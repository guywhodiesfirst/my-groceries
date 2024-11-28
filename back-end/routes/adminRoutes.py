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
    if not user or not user.get('is_admin') == True:
        return False
    else: return True


adminRoutes = Blueprint('admin', __name__)

# Дані для SMTP сервера
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "mrgumor2017@gmail.com"
EMAIL_PASSWORD = "gqzx swgv cyyo bvle"


@adminRoutes.route('/admin/product', methods=['POST'])
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
    image = request.json.get('image')

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
        'image': image,
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
    _id = ObjectId(request.json.get('_id'))

    # Перевірка наявності продукту
    product = mongo.db.products.find_one({'_id': _id})
    if not product:
        return jsonify(message="Product not found."), 404

    # Видаляємо продукт з бази даних
    mongo.db.products.delete_one({'_id': _id})

    return jsonify(message="Продукт видалено успішно."), 200

@adminRoutes.route('/admin/product', methods=['PUT'])
@jwt_required()
def editProduct():
    from app import mongo
    currentUser = get_jwt_identity()

    if checkadmin(currentUser) == False:
        return jsonify(message="Потрібні права адміністратора"), 403

    # Отримуємо дані для оновлення продукту
    _id = ObjectId(request.json.get('_id'))
    updatedName = request.json.get('name')
    updatedPrice = request.json.get('price')
    updatedQuantity = request.json.get('quantity')
    updatedCategory = request.json.get('category')
    updatedDescription = request.json.get('description')
    updatedImage = request.json.get('image')

    # Перевірка наявності продукту
    product = mongo.db.products.find_one({'_id': _id})
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
    if updatedImage:
        updateData['image'] = updatedImage

    # Оновлюємо продукт в базі даних
    if updateData:
        mongo.db.products.update_one({'_id': _id}, {'$set': updateData})

    return jsonify(message="Продукт оновлено успішно"), 200

@adminRoutes.route('/admin/users', methods=['PATCH']) #Функція для налаштування рівня доступа
@jwt_required()
def setUser():
    from app import mongo
    currentUser = get_jwt_identity()

    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    userID = request.json.get('userId')
    isadmin = request.json.get('admin')
    isblocked = request.json.get('blocked')
    isrunner = request.json.get('runner')

    try:
        userID = ObjectId(userID)
    except:
        return jsonify(message="Невірний формат ID користувача"), 400

    user = mongo.db.users.find_one({"_id": userID}, {"_id": 1})

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


@adminRoutes.route('/admin/users', methods=['DELETE'])#Функція для видалення користувача
@jwt_required()
def delUser():
    from app import mongo
    currentUser = get_jwt_identity()

    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    userID = request.json.get('userId')

    try:
        userID = ObjectId(userID)
    except:
        return jsonify(message="Невірний формат ID користувача"), 400

    if mongo.db.users.find_one({"_id": userID}, {"_id": 1}):
        mongo.db.users.delete_one({'_id': userID})
        return jsonify("Користувача видалено успішно"), 200
    else:
        return jsonify("Помилка видалення користувача"), 500

@adminRoutes.route('/admin/users', methods=['GET'])
@jwt_required()
def getUsersByRoles():
    from app import mongo

    currentUser = get_jwt_identity()
    if not checkadmin(currentUser):
        return jsonify(message="Потрібні права адміністратора"), 403

    # Отримуємо тип користувача
    userType = request.args.get('userType')
    dbType = {"_id": 1, "username": 1, "email": 1, "is_admin": 1, "is_runner": 1, "is_blocked": 1}

    # Виконуємо фільтрацію
    if userType == 'admin':
        usersCursor = mongo.db.users.find({"is_admin": True}, dbType)
    elif userType == 'runner':
        usersCursor = mongo.db.users.find({"is_runner": True}, dbType)
    elif userType == 'blocked':
        usersCursor = mongo.db.users.find({"is_blocked": True}, dbType)
    else:
        usersCursor = mongo.db.users.find({}, dbType)

    # Формуємо список
    users = []
    for user in usersCursor:
        roles = []
        if user.get("is_admin"):
            roles.append("admin")
        if user.get("is_runner"):
            roles.append("runner")
        if user.get("is_blocked"):
            roles.append("blocked")
        users.append({
            "_id": str(user["_id"]),
            "username": user.get("username", "No username"),
            "email": user.get("email", "No email"),
            "roles": roles if roles else ["user"]
        })

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

@adminRoutes.route('/admin/statistics', methods=['GET'])
@jwt_required()
def get_statistics():
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
