import re
import hashlib
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bcrypt import hashpw, gensalt, checkpw

authRoutes = Blueprint('auth', __name__)

# Дані для SMTP сервера (приклад для Gmail)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "mrgumor2017@gmail.com"
EMAIL_PASSWORD = "gqzx swgv cyyo bvle"


# Функція перевірки правильності email
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

# Функція генерації 6-значного коду підтвердження
def generate_verification_code(email):
    today = datetime.now().strftime('%Y-%m-%d')
    data = email + today
    hash_object = hashlib.sha256(data.encode())
    hash_hex = hash_object.hexdigest()
    verification_code = int(hash_hex[:6], 16) % 1000000  # Limit to 6 digits
    return verification_code


# Функція надсилання коду підтвердження електронною поштою
def send_verification_code(email, code):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = email
        msg["Subject"] = "Код підтвердження реєстрації"
        body = f"Ваш код підтвердження: {code}"
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, email, msg.as_string())
        return jsonify({'message': 'Код для відновлення пароля надіслано на ваш email'}), 200
    except Exception as e:
        return jsonify({'message': 'Помилка при надсиланні email'}), 400

# Функція надсилання коду скидання електронною поштою
def send_reset_code(email, code):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = email
        msg["Subject"] = "Код підтвердження для відновлення пароля"
        body = f"Ваш код підтвердження для відновлення пароля: {code}"
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, email, msg.as_string())

        return jsonify({'message': 'Код для відновлення пароля надіслано на ваш email'}), 200
    except Exception as e:
        return jsonify({'message': 'Помилка при надсиланні email'}), 400
@authRoutes.route('/register', methods=['POST'])
def register():
    from app import mongo
    email = request.json.get('email')
    password = request.json.get('password')
    username = request.json.get('username')
    name = request.json.get('name')
    surname = request.json.get('surname')

    if not is_valid_email(email):
        return jsonify({'message': 'Недійсний формат email'}), 400

    # Хешування паролю
    hashedPassword = hashpw(password.encode('utf-8'), gensalt())

    # Перевірка наявності користувача
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'message': 'Користувач вже існує'}), 409

    mongo.db.users.insert_one({
        'email': email,
        'password': hashedPassword,
        'isVerified': False,
        'is_admin': False,
        'is_runner': False,
        'is_blocked': False,
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


# Окремий шлях для запиту нового коду підтвердження
@authRoutes.route('/request_verification', methods=['POST'])
def request_verification():
    from app import mongo
    email = request.json.get('email')

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'message': 'Користувача не знайдено'}), 404

    # Генерація і надсилання нового коду підтвердження
    verification_code = generate_verification_code(email)
    send_verification_code(email, verification_code)

    # Оновлення документу користувача новим кодом підтвердження
    mongo.db.users.update_one({'email': email}, {'$set': {'verification_code': verification_code}})

    return jsonify({'message': 'Код підтвердження надіслано на вашу електронну пошту.'}), 200

# Маршрут для перевірки коду
@authRoutes.route('/verify_code', methods=['POST'])
def verify_code():
    from app import mongo
    email = request.json.get('email')
    code = request.json.get('code')

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'message': 'Користувача не знайдено'}), 404

    # Перевірка, чи наданий код відповідає збереженому
    if user.get('verification_code') == int(code):
        mongo.db.users.update_one(
            {'email': email},
            {'$set': {'isVerified': True}, '$unset': {'verification_code': ""}}
        )
        return jsonify({'message': 'Електронна адреса успішно підтверджена!'}), 200

    return jsonify({'message': 'Неправильний код підтвердження'}), 400

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

# Надсилання запиту на скидання пароля (код на підтверджену електронну адресу)
@authRoutes.route('/request_password_reset', methods=['POST'])
def request_password_reset():
    from app import mongo
    email = request.json.get('email')

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'message': 'Користувача не знайдено'}), 404

    if not user.get('isVerified', False):
        return jsonify({'message': 'Email не підтверджено. Підтвердіть електронну пошту перед відновленням пароля.'}), 403

    # Генерація та надсилання коду скидання
    reset_code = generate_verification_code(email)
    send_reset_code(email, reset_code)

    # Збереження коду скидання в документі користувача
    mongo.db.users.update_one({'email': email}, {'$set': {'reset_code': reset_code}})

    return jsonify({'message': 'Код для відновлення пароля надіслано на вашу електронну пошту.'}), 200

# Зміна паролю
@authRoutes.route('/reset_password', methods=['POST'])
def reset_password():
    from app import mongo
    email = request.json.get('email')
    code = request.json.get('code')
    new_password = request.json.get('new_password')

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'message': 'Користувача не знайдено'}), 404

    # Verify reset code
    if user.get('reset_code') != int(code):
        return jsonify({'message': 'Неправильний код підтвердження'}), 400

    # Hash the new password and update it in the database
    hashed_password = hashpw(new_password.encode('utf-8'), gensalt())
    mongo.db.users.update_one(
        {'email': email},
        {'$set': {'password': hashed_password}, '$unset': {'reset_code': ""}}
    )

    return jsonify({'message': 'Пароль відновлено успішно'}), 200


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
            'username': user.get('username'),
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
        username = request.json.get('username')
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
                    'username': username,
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
