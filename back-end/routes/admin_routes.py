from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
def checkadmin(currentUser):
    from app import mongo
    user = mongo.db.users.find_one({'email': currentUser})
    print(user)
    if not user or not user.get('is_admin') == True:
        return False
    else: return True


adminRoutes = Blueprint('admin', __name__)

@adminRoutes.route('/admin/product', methods=['PUT'])
@jwt_required()
def addProduct():
    from app import mongo
    currentUser = get_jwt_identity()

    if checkadmin(currentUser) == False:
        return jsonify(message="Потрібні права адміністратора"), 403

    # Отримуємо деталі продукту з запиту
    name = request.json.get('name')
    price = request.json.get('price')
    quantity = request.json.get('quantity')
    category = request.json.get('category')
    description = request.json.get('description')

    # Перевірка обов'язкових полів
    if not name or not isinstance(price, (int, float)) or not isinstance(quantity, (int, float)) or not description:
        return jsonify(message="Помилка: некоректні дані"), 422

    # Додаємо продукт в базу даних
    mongo.db.products.insert_one({
        'name': name,
        'price': price,
        'quantity': quantity,
        'category': category,
        'description': description,
    })

    return jsonify(message="Продукт додано успішно"), 201

@adminRoutes.route('/admin/product', methods=['DELETE'])
@jwt_required()
def deleteProduct():
    from app import mongo
    currentUser = get_jwt_identity()

    if checkadmin(currentUser) == False:
        return jsonify(message="Потрібні права адміністратора"), 403

    # Отримуємо назву продукту з запиту
    productName = request.json.get('productName')

    # Перевірка наявності продукту
    product = mongo.db.products.find_one({'name': productName})
    if not product:
        return jsonify(message="Product not found."), 404

    # Видаляємо продукт з бази даних
    mongo.db.products.delete_one({'name': productName})

    return jsonify(message="Product deleted successfully."), 200

@adminRoutes.route('/admin/product', methods=['PUT'])
@jwt_required()
def editProduct():
    from app import mongo
    currentUser = get_jwt_identity()

    if checkadmin(currentUser) == False:
        return jsonify(message="Потрібні права адміністратора"), 403

    # Отримуємо дані для оновлення продукту
    productName = request.json.get('productName')
    updatedName = request.json.get('newName')
    updatedPrice = request.json.get('newPrice')
    updatedQuantity = request.json.get('newQuantity')
    updatedCategory = request.json.get('newCategory')
    updatedDescription = request.json.get('newDescription')

    # Перевірка наявності продукту
    product = mongo.db.products.find_one({'name': productName})
    if not product:
        return jsonify(message="Продукт не знайдено"), 404

    # Створюємо оновлені дані, які можуть бути змінені
    updateData = {}
    if updatedName:
        updateData['name'] = updatedName
    if updatedPrice is not None:
        updateData['price'] = updatedPrice
    if updatedQuantity is not None:
        updateData['quantity'] = updatedQuantity
    if updatedCategory:
        updateData['category'] = updatedCategory
    if updatedDescription:
        updateData['description'] = updatedDescription

    # Оновлюємо продукт в базі даних
    if updateData:
        mongo.db.products.update_one({'name': productName}, {'$set': updateData})

    return jsonify(message="Продукт оновлено успішно"), 200

@adminRoutes.route('/admin/getAllUsersNick', methods=['GET'])
@jwt_required()
def getAllUsers():
    from app import mongo
    currentUser = get_jwt_identity()

    # Проверка прав администратора
    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    usersCursor = mongo.db.users.find({}, {"_id": 1, "nickname": 1})
    users = [{"_id": str(user["_id"]), "nickname": user.get("nickname", "No nickname")} for user in usersCursor]

    try:
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500