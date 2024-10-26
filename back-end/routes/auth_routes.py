from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bcrypt import hashpw, gensalt, checkpw

authRoutes = Blueprint('auth', __name__)

@authRoutes.route('/register', methods=['POST'])
def register():
    from app import mongo
    email = request.json.get('email')
    password = request.json.get('password')
    username = request.json.get('username')
    name = request.json.get('name')
    surname = request.json.get('surname')

    # Хешування паролю
    hashedPassword = hashpw(password.encode('utf-8'), gensalt())

    # Перевірка наявності користувача
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'message': 'Користувач вже існує'}), 409

    mongo.db.users.insert_one({
        'email': email,
        'password': hashedPassword,
        'isVerified': False,
        'isAdmin': False,
        'orders': [],
        'phoneNumber': "",
        'name': name,
        'surname': surname,
        'profile': {},
        'cardNumber': "",
        'cardCVV': "",
        'cardDate': "",
        'deliveryMethod': "",
        'paymentMethod': "",
        'deliveryPlace': "",
        'username': username
    })

    return jsonify({'message': 'Користувач зареєстрований! Перевірте електронну пошту та телефон для підтвердження.'}), 201


# Авторизація
@authRoutes.route('/login', methods=['POST'])
def login():
    from app import mongo
    email = request.json.get('email')
    password = request.json.get('password')

    user = mongo.db.users.find_one({'email': email})

    if user and checkpw(password.encode('utf-8'), user['password']):
        access_token = create_access_token(identity=user['email'])
        return jsonify(access_token=access_token), 200

    return jsonify(message="Неправильний логін або пароль"), 401


# Зміна паролю
@authRoutes.route('/change_password', methods=['POST'])
def reset_password():
    from app import mongo
    email = request.json.get('email')
    new_password = request.json.get('new_password')

    hashedPassword = hashpw(new_password.encode('utf-8'), gensalt())

    mongo.db.users.update_one({'email': email}, {'$set': {'password': hashedPassword}})

    return jsonify(message="Пароль відновлено успішно"), 200


@authRoutes.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    from app import mongo
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({'email': current_user})

    if request.method == 'GET':
        return jsonify({
            'name': user.get('name'),
            'surname': user.get('surname'),
            'phoneNumber': user.get('phoneNumber'),
            'cardNumber': user.get('cardNumber'),
            'cardDate': user.get('cardDate'),
            'cardCVV': user.get('cardCVV'),
            'deliveryMethod': user.get('deliveryMethod'),
            'paymentMethod': user.get('paymentMethod'),
            'deliveryPlace': user.get('deliveryPlace')
        }), 200

    if request.method == 'PUT':
        # Отримання даних з запиту
        phoneNumber = request.json.get('phoneNumber')
        name = request.json.get('name')
        surname = request.json.get('surname')
        cardNumber = request.json.get('cardNumber')
        cardDate = request.json.get('cardDate')
        cardCVV = request.json.get('cardCVV')
        deliveryMethod = request.json.get('deliveryMethod')
        paymentMethod = request.json.get('paymentMethod')
        deliveryPlace = request.json.get('deliveryPlace')

        # Перевірка на наявність всіх необхідних полів
        if not all([phoneNumber, name, surname, cardNumber, cardDate, cardCVV, deliveryMethod, paymentMethod]):
            return jsonify(message="Всі поля повинні бути заповнені."), 422

        # Оновлення документа користувача
        result = mongo.db.users.update_one(
            {'email': current_user},
            {
                '$set': {
                    'phoneNumber': phoneNumber,
                    'name': name,
                    'surname': surname,
                    'cardNumber': cardNumber,
                    'cardDate': cardDate,
                    'cardCVV': cardCVV,
                    'deliveryMethod': deliveryMethod,
                    'paymentMethod': paymentMethod,
                    'deliveryPlace': deliveryPlace
                }
            }
        )

        if result.matched_count == 0:
            return jsonify(message="Користувача не знайдено."), 404

        return jsonify(message="Профіль успішно оновлено."), 200
