from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId

cartRoutes = Blueprint('cart', __name__)


@cartRoutes.route('/cartSum', methods=['POST'])
@jwt_required()
def cartSum():
    from app import mongo
    currentUser = get_jwt_identity()
    user = mongo.db.users.find_one({'email': currentUser})

    # Перевіряємо, чи є у користувача кошик
    if not user or 'cart' not in user:
        return jsonify(message="Кошик порожній."), 200

    totalSum = 0
    for item in user['cart']:
        productId = item.get('productId')
        quantity = item.get('quantity', 1)  # За замовчуванням кількість 1

        # Знаходимо продукт у базі даних
        product = mongo.db.products.find_one({'_id': ObjectId(productId)})

        if product:
            totalSum += product['price'] * quantity  # Підсумовуємо вартість
        else:
            return jsonify(message=f"Товар з ID {productId} не знайдено."), 404

    return jsonify(totalSum=totalSum), 200

@cartRoutes.route('/cart', methods=['GET', 'POST', 'DELETE','PUT'])
@jwt_required()
def cart():
    from app import mongo
    currentUser = get_jwt_identity()
    user = mongo.db.users.find_one({'email': currentUser})

    if request.method == 'PUT':
        # Отримуємо назву продукту та кількість із запиту
        productName = request.json.get('product name')
        quantityToAdd = request.json.get('quantity', 1)  # Додаємо 1, якщо кількість не вказана

        # Перевіряємо наявність товару в базі даних
        product = mongo.db.products.find_one({'name': productName})

        # Перевіряємо, чи існує продукт та достатня його кількість
        if not product or product.get("quantity", 0) < quantityToAdd:
            return jsonify(message="Product not found or insufficient stock."), 404

        # Перевіряємо, чи є продукт вже у кошику
        cartItem = mongo.db.users.find_one(
            {'email': currentUser, 'cart.productId': product['_id']},
            {'cart.$': 1}  # Повертаємо лише елемент кошика, якщо він існує
        )

        if cartItem:  # Якщо продукт вже у кошику, збільшуємо кількість
            mongo.db.users.update_one(
                {'email': currentUser, 'cart.productId': product['_id']},
                {'$inc': {'cart.$.quantity': quantityToAdd}}  # Збільшуємо кількість у кошику
            )
        else:  # Якщо продукт не у кошику, додаємо його з кількістю
            mongo.db.users.update_one(
                {'email': currentUser},
                {'$addToSet': {'cart': {'productId': product['_id'], 'quantity': quantityToAdd}}}
                # Додаємо новий продукт у кошик
            )
        return jsonify(message="Product added to cart"), 201


    if request.method == 'GET':
        # Отримання товарів з кошика
        cartItems = [
            {'productId': str(item['productId']), 'quantity': item.get('quantity', 1)}
            for item in user.get('cart', [])
        ]
        return jsonify(cartItems), 200

    if request.method == 'POST':
        productId = request.json.get('productId')
        mongo.db.users.update_one(
            {'email': currentUser},
            {'$addToSet': {'cart': {'productId': ObjectId(productId), 'quantity': 1}}}
        )
        return jsonify(message="Product added to cart"), 201

    if request.method == 'DELETE':
        productId = request.json.get('productId')
        try:
            productIdObj = ObjectId(productId)
        except Exception as e:
            return jsonify(message="Невірний формат ID продукту."), 422

        result = mongo.db.users.update_one(
            {'email': currentUser},
            {'$pull': {'cart': {'productId': productIdObj}}}
        )

        if result.modified_count == 0:
            return jsonify(message="Продукт не знайдено в кошику."), 404

        return jsonify(message="Продукт видалено з кошика"), 200

# Оформлення замовлення
@cartRoutes.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    from app import mongo
    currentUser = get_jwt_identity()
    user = mongo.db.users.find_one({'email': currentUser})

    orderDetails = request.json.get('orderDetails')
    deliveryAddress = request.json.get('deliveryAddress')
    paymentMethod = request.json.get('paymentMethod')

    # Створюємо замовлення
    order = {
        'products': user.get('cart', []),
        'deliveryAddress': deliveryAddress,
        'paymentMethod': paymentMethod,
        'orderDetails': orderDetails,
        'status': 'Pending'
    }

    mongo.db.users.update_one({'email': currentUser},
                              {'$set': {'cart': [], 'orders': user.get('orders', []) + [order]}})
    return jsonify(message="Замовлення успішно оформлене"), 201
