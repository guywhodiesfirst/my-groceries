import os


class Config:
    # MongoDB конфігурація
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/databaseProductShop")

    # JWT конфігупація
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")

    # Налаштування безпеки
    BCRYPT_LOG_ROUNDS = 12
    JWT_ACCESS_TOKEN_EXPIRES = 3600
