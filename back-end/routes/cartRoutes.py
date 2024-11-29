from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
import hashlib
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from flask import url_for

cartRoutes = Blueprint('cart', __name__)

# Дані для SMTP сервера
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "mrgumor2017@gmail.com"
EMAIL_PASSWORD = "gqzx swgv cyyo bvle"



@cartRoutes.route('/cartSum', methods=['GET'])
@jwt_required()
def cartSum():
    from app import mongo
    currentUser = get_jwt_identity()
    user = mongo.db.users.find_one({'email': currentUser})

    # Перевірка наявності кошика
    if not user or 'cart' not in user:
        return jsonify(message="Кошик порожній."), 200

    totalSum = 0
    for item in user['cart']:
        try:
            # Конвертуємо productId в ObjectId
            productId = ObjectId(item.get('productId'))
            quantity = item.get('quantity', 1)

            # Знаходимо продукт у базі даних
            product = mongo.db.products.find_one({'_id': productId})

            if product:
                totalSum += product['price'] * quantity
            else:
                return jsonify(message=f"Товар з ID {productId} не знайдено."), 404

        except Exception as e:
            return jsonify(message=f"Помилка при обробці товару з ID {item.get('productId')}: {str(e)}"), 500
    
    return jsonify(totalSum=totalSum), 200



@cartRoutes.route('/cart', methods=['GET', 'POST', 'DELETE','PUT'])
@jwt_required()
def cart():
    from app import mongo
    currentUser = get_jwt_identity()
    user = mongo.db.users.find_one({'email': currentUser})

    if request.method == 'PUT':
        # Отримуємо ID продукту та кількість із запиту
        productId = request.json.get('productId')
        quantityToAdd = request.json.get('quantityToAdd', 1)  # Додаємо 1, якщо кількість не вказана
        # Перевіряємо наявність товару в базі даних
        product = mongo.db.products.find_one({'_id': ObjectId(productId)})
        # Перевіряємо, чи існує продукт та достатня його кількість
        if not product or product.get("quantity", 0) < quantityToAdd:
            return jsonify(message="Продукт не знайдено або він закінчився."), 404
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
        return jsonify(message="Продукт додано до кошика"), 201


    if request.method == 'GET':
        # Перевіряємо, чи у користувача є кошик
        cart = user.get('cart', [])
        if not cart:
            return jsonify(message="Кошик порожній"), 200

        # Ініціалізуємо список для збереження детальної інформації про товари
        cartDetails = []

        # Проходимо по кожному товару в кошику
        for item in cart:
            try:
                # Конвертуємо `productId` в `ObjectId`
                productId = ObjectId(item['productId'])
                quantity = item.get('quantity', 1)

                # Отримуємо деталі товару з бази
                product = mongo.db.products.find_one({'_id': productId})

                if product:
                    # Додаємо деталі товару до списку
                    cartDetails.append({
                        'productId': str(product['_id']),
                        'name': product.get('name', 'Невідомий товар'),
                        'image': product.get('image', ''),
                        'price': product.get('price', 0),
                        'quantity': quantity,
                        'total': product.get('price', 0) * quantity
                    })
                else:
                    cartDetails.append({
                        'productId': str(productId),
                        'name': 'Товар не знайдено',
                        'image': '',
                        'price': 0,
                        'quantity': quantity,
                        'total': 0
                    })

            except Exception as e:
                return jsonify(message=f"Помилка при отриманні даних для товару: {str(e)}"), 500

        return jsonify(cartDetails), 200

    if request.method == 'POST':
        productId = request.json.get('productId')
        mongo.db.users.update_one(
            {'email': currentUser},
            {'$addToSet': {'cart': {'productId': ObjectId(productId), 'quantity': 1}}}
        )
        return jsonify(message="Продукт додано до кошика"), 201

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


def send_confirmation_email(email, order_id, total_sum):
    confirmation_token = hashlib.sha256(f"{email}{order_id}".encode()).hexdigest()
    confirmation_link = url_for('cart.confirm_order', order_id=order_id, token=confirmation_token, _external=True)

    msg = MIMEMultipart()
    msg["From"] = EMAIL_SENDER
    msg["To"] = email
    msg["Subject"] = "Підтвердження замовлення"

    body = f"""
    Ви підтверджуєте замовлення #{order_id}? 
    Сума замовлення: {total_sum} грн.
    Перейдіть за посиланням для підтвердження: {confirmation_link}
    """
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, email, msg.as_string())
    return jsonify(message="Лист з підтвердженням замовлення надіслано."), 202



# Оформлення замовлення
@cartRoutes.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    from app import mongo
    currentUser = get_jwt_identity()
    user = mongo.db.users.find_one({'email': currentUser})

    if user.get('isBlocked', False):
        return jsonify(message="Ваш обліковий запис заблоковано. Оформлення замовлення неможливе."), 403

    orderDetails = request.json.get('orderDetails')
    deliveryAddress = request.json.get('deliveryAddress')
    paymentMethod = request.json.get('paymentMethod')

    cart_sum_response, status_code = cartSum()  # Розпаковуємо результат у відповідь і статус-код
    if status_code != 200:
        return cart_sum_response, status_code  # Повертаємо помилку, якщо її повернув /cartSum

    totalSum = cart_sum_response.json['totalSum']  # Отримуємо totalSum із відповіді

    # Створюємо замовлення
    order = {
        'user_email': currentUser,
        'products': user.get('cart', []),
        'deliveryAddress': deliveryAddress,
        'paymentMethod': paymentMethod,
        'orderDetails': orderDetails,
        'status': 'Pending',
        'orderDate': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    # Вставляємо замовлення в колекцію orders
    try:
        order_result = mongo.db.orders.insert_one(order)  # Додаємо нове замовлення в колекцію orders
        order_id = order_result.inserted_id  # Отримуємо id нового замовлення

        # Очищаємо кошик користувача
        mongo.db.users.update_one(
            {'email': currentUser},
            {'$set': {'cart': []}}  # Очищаємо кошик
        )

        send_confirmation_email(currentUser, order_id, totalSum)

        result = mongo.db.users.update_one(
            {'email': currentUser},  # Шукаємо користувача
            {
                '$push': {'orders': order},  # Додаємо нове замовлення в масив
                '$set': {'cart': []}  # Очищаємо кошик
            }
        )

        if result.modified_count == 1:
            return jsonify(message="Замовлення створено. Підтвердження надіслано на вашу електронну пошту."), 200
        else:
            return jsonify(message="Не вдалося створити замовлення."), 500

    except Exception as e:
        return jsonify(message=f"Помилка бази даних: {str(e)}"), 500




@cartRoutes.route('/confirm_order/<order_id>/<token>', methods=['GET'])
@jwt_required()
def confirm_order(order_id, token):
    from app import mongo
    currentUser = get_jwt_identity()  # Отримуємо електронну пошту користувача
    user = mongo.db.users.find_one({'email': currentUser})

    if user is None:
        return jsonify(message="Користувача не знайдено."), 404

    # Перевіряємо наявність email у користувача
    if 'email' not in user:
        return jsonify(message="Користувача не знайдено."), 404

    # Генеруємо очікуваний токен і перевіряємо його з тим, що отримано
    expected_token = hashlib.sha256(f"{user['email']}{order_id}".encode()).hexdigest()
    if token != expected_token:
        return jsonify(message="Невірний токен."), 403

    # Оновлення статусу замовлення на "Підтверджено"
    mongo.db.users.update_one(
        {'_id': user['_id'], 'orders._id': ObjectId(order_id)},
        {'$set': {'orders.$.status': 'Confirmed'}}
    )

    # Знаходимо всіх кур'єрів з is_runner = True
    runners = mongo.db.users.find({'is_runner': True})

    # Відправка повідомлення кожному кур'єру
    for runner in runners:
        runner_email = runner.get('email')
        if runner_email:
            send_runner_notification(runner_email, order_id)  # Викликаємо функцію для відправки email

    return jsonify(message="Замовлення підтверджено успішно. Повідомлення кур'єрам надіслано."), 200


def send_runner_notification(email, order_id):
    """Функція для відправки повідомлення кур'єру про нове замовлення."""
    msg = MIMEMultipart()
    msg["From"] = EMAIL_SENDER
    msg["To"] = email
    msg["Subject"] = "Нове замовлення на доставку"

    body = f"Шановний кур'єре, нове замовлення з номером {order_id} підтверджено та потребує доставки."
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, email, msg.as_string())

