from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
def checkadmin(currentUser):
    from app import mongo
    user = mongo.db.users.find_one({'email': currentUser})
    print(user)
    if not user or not user.get('is_admin') == True:
        return False
    else: return True


adminRoutes = Blueprint('admin', __name__)

# Дані для SMTP сервера
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "mrgumor2017@gmail.com"
EMAIL_PASSWORD = "gqzx swgv cyyo bvle"


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
    productName = request.json.get('product name')

    # Перевірка наявності продукту
    product = mongo.db.products.find_one({'name': productName})
    if not product:
        return jsonify(message="Product not found."), 404

    # Видаляємо продукт з бази даних
    mongo.db.products.delete_one({'name': productName})

    return jsonify(message="Продукт видалено успішно."), 200

@adminRoutes.route('/admin/product', methods=['POST'])
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

@adminRoutes.route('/admin/users', methods=['GET']) # Функція для виведення ніків та ID всіх користувачів
@jwt_required()
def getUsers():
    from app import mongo
    currentUser = get_jwt_identity()

    # Проверка прав администратора
    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    usersCursor = mongo.db.users.find({}, {"_id": 1, "username": 1})
    users = [{"_id": str(user["_id"]), "username": user.get("username", "No username")} for user in usersCursor]

    try:
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@adminRoutes.route('/admin/adminPanel', methods=['POST']) #Функція для налаштування рівня доступа
@jwt_required()
def setUser():
    from app import mongo
    currentUser = get_jwt_identity()

    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    userID = request.json.get('user id')
    isadmin = request.json.get('is admin')
    isblocked = request.json.get('is blocked')
    isrunner = request.json.get('is runner')
    username = request.json.get('username')

    try:
        userID = ObjectId(userID)
    except:
        return jsonify(message="Невірний формат ID користувача"), 400

    user = mongo.db.users.find_one({"_id": userID, "username": username}, {"_id": 1})

    if user:

        result1 = mongo.db.users.update_one({'_id': userID}, {'$set': {'is_admin': bool(isadmin)}})
        result2 = mongo.db.users.update_one({'_id': userID}, {'$set': {'is_runner': bool(isrunner)}})
        result3 = mongo.db.users.update_one({'_id': userID}, {'$set': {'is_blocked': bool(isblocked)}})

        if result1.modified_count > 0:
            return jsonify(message="Статус користувача оновлено (адмін)"), 200
        elif result2.modified_count > 0:
            return jsonify(message="Статус користувача оновлено (кур'єр)"), 200
        elif result3.modified_count > 0:
            return jsonify(message="Статус користувача оновлено (блок)"), 200
        else:
            return jsonify(message="Оновлень не відбулось"), 200
    else:
        return jsonify(message="Користувача не знайдено"), 404


@adminRoutes.route('/admin/adminPanel', methods=['DELETE'])#Функція для видалення користувача
@jwt_required()
def delAdmins():
    from app import mongo
    currentUser = get_jwt_identity()

    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    userID = request.json.get('user id')
    username = request.json.get('username')

    try:
        userID = ObjectId(userID)
    except:
        return jsonify(message="Невірний формат ID користувача"), 400

    if mongo.db.users.find_one({"_id": userID, "username": username}, {"_id": 1}):
        mongo.db.users.delete_one({'_id': userID})
        return jsonify("Користувача видалено успішно"), 200
    else:
        return jsonify("Помилка видалення користувача"), 500

@adminRoutes.route('/admin/adminPanel', methods=['GET'])
@jwt_required()
def getTypesUsers():
    from app import mongo
    import re

    currentUser = get_jwt_identity()
    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    # Отримаємо фільтр
    userType = request.json.get('userType')

    if userType == 'admin':
        usersCursor = mongo.db.users.find({"is_admin": True}, {"_id": 1, "username": 1})
    elif userType == 'runner':
        usersCursor = mongo.db.users.find({"is_runner": True}, {"_id": 1, "username": 1})
    elif userType == 'blocked':
        usersCursor = mongo.db.users.find({"is_blocked": True}, {"_id": 1, "username": 1})
    else:
        return jsonify(message="Невідомий тип користувача"), 400

    # Формуємо список
    users = [{"_id": str(user["_id"]), "username": user.get("username", "No username")} for user in usersCursor]

    try:
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def send_order_status_email(email, order_id, status):
    subject = f"Оновлення статусу замовлення #{order_id}"
    body = f"Ваше замовлення #{order_id} зараз має статус: {status}."

    msg = MIMEMultipart()
    msg["From"] = EMAIL_SENDER
    msg["To"] = email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, email, msg.as_string())
        return jsonify({'message': 'Повідомлення про оновлення статусу надіслано.'}), 200
    except Exception as e:
        return jsonify({'message': 'Помилка при надсиланні email'}), 400


def update_order_status(user_email, order_id, new_status):
    from app import mongo

    result = mongo.db.users.update_one(
        {'email': user_email, 'orders._id': ObjectId(order_id)},
        {'$set': {'orders.$.status': new_status,
                  'orders.$.statusUpdateDate': datetime.now().strftime('%Y-%m-%d %H:%M:%S')}}
    )

    if result.modified_count > 0:
        # Надіслати сповіщення користувачеві про оновлення статусу
        send_order_status_email(user_email, order_id, new_status)
        return True
    else:
        return jsonify({'message': 'Не вдалося оновити статус замовлення.'}), 400
        return False

@adminRoutes.route('/admin/update_order_status/<order_id>', methods=['POST'])
@jwt_required()
def admin_update_order_status(order_id):
    currentUser = get_jwt_identity()
    if not checkadmin(currentUser):  # Функція для перевірки прав адміністратора
        return jsonify(message="Недостатньо прав доступу."), 403

    user_email = request.json.get('email')
    new_status = request.json.get('status')

    valid_statuses = ["Pending", "Confirmed", "Processing", "Delivered"]
    if new_status not in valid_statuses:
        return jsonify(message="Невірний статус замовлення."), 400

    if update_order_status(user_email, order_id, new_status):
        return jsonify(message=f"Статус замовлення оновлено на '{new_status}'"), 200
    else:
        return jsonify(message="Помилка при оновленні статусу замовлення."), 500

@adminRoutes.route('/admin/order_statistics', methods=['GET'])
@jwt_required()
def get_order_statistics():
    from app import mongo
    currentUser = get_jwt_identity()
    if not checkadmin(currentUser):
        return jsonify(message="Недостатньо прав доступу."), 403

    try:
        # Total orders
        total_orders = mongo.db.orders.count_documents({})

        total_sales = sum(order.get("total_price", 0) for order in mongo.db.orders.find({}, {"total_price": 1}))

        order_status_counts = mongo.db.orders.aggregate([
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ])

        status_counts = {status["_id"]: status["count"] for status in order_status_counts}

        current_month = datetime.now().month
        monthly_orders = mongo.db.orders.count_documents({
            "order_date": {"$gte": datetime(datetime.now().year, current_month, 1)}
        })


        monthly_sales = sum(order.get("total_price", 0) for order in mongo.db.orders.find({
            "order_date": {"$gte": datetime(datetime.now().year, current_month, 1)}
        }, {"total_price": 1}))


        statistics = {
            "total_orders": total_orders,
            "total_sales": total_sales,
            "status_counts": status_counts,
            "monthly_orders": monthly_orders,
            "monthly_sales": monthly_sales,
        }

        return jsonify(statistics), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
