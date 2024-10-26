import os


class Config:
    # MongoDB configuration
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/databaseProductShop")

    # JWT configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")

    # Security settings
    BCRYPT_LOG_ROUNDS = 12  # Complexity for bcrypt hashing
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # JWT token expiration in seconds (1 hour)
