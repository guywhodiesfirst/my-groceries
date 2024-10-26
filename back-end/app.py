from flask import Flask
from flask_pymongo import PyMongo
from config import Config
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)
mongo = PyMongo(app)
jwt = JWTManager(app)
# Импорт маршрутов после инициализации приложения и MongoDB
from routes import authRoutes, productRoutes, cartRoutes, adminRoutes

# Регистрация Blueprint'ов
app.register_blueprint(authRoutes)
app.register_blueprint(productRoutes)
app.register_blueprint(cartRoutes)
app.register_blueprint(adminRoutes)
if __name__ == "__main__":
    app.run()