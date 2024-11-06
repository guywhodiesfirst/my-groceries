import re

from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

productRoutes = Blueprint('product', __name__)

@productRoutes.route('/products', defaults={'product_id': None}, methods=['GET'])
@productRoutes.route('/products/<product_id>', methods=['GET'])
def getProducts(product_id):
    from app import mongo
    category = request.json.get('category')
    nameSubstring = request.json.get('name')
    isCatList = request.json.get('categoryList')

    try:
        if isCatList:
            categories = []
            categoriesCursor = mongo.db.products.find({}, {'category': 1})

            for product in categoriesCursor:
                category = product.get('category', [])
                if category not in categories:
                    categories.append(category)
            return jsonify({'categories': categories, 'message': 'Пошук пройшов успішно'}), 200

        # Пошук продукта по ID
        if product_id:
            product = mongo.db.products.find_one({'_id': ObjectId(product_id)})

            if not product:
                return jsonify({"error": "Продукт не знайдено"}), 404

            product['_id'] = str(product['_id'])
            return jsonify(product), 200

        # Фільтрація по категорії
        elif category:
            productsCursor = mongo.db.products.find({'category': category})
            products = [
                {
                    "_id": str(product["_id"]),
                    "name": product.get("name", "No name"),
                    "description": product.get("description", "No description"),
                    "quantity": product.get("quantity", "0"),
                    "price": product.get("price", "No price")
                }
                for product in productsCursor
            ]
            if not products:
                return jsonify({'message': 'Продуктів у цій категорії не знайдено'}), 404
            return jsonify({'products': products, 'message': 'Продукти за категорією знайдено'}), 200

        # Фільтрація по частині імені
        elif nameSubstring:
            productsCursor = mongo.db.products.find(
                {'name': {'$regex': re.escape(nameSubstring), '$options': 'i'}}
            )
            products = [
                {
                    "_id": str(product["_id"]),
                    "name": product.get("name", "No name"),
                    "description": product.get("description", "No description"),
                    "quantity": product.get("quantity", "0"),
                    "price": product.get("price", "No price")
                }
                for product in productsCursor
            ]
            if not products:
                return jsonify({'message': 'Продукти не знайдено'}), 404
            return jsonify({'products': products, 'message': 'Продукти за частиною імені знайдено'}), 200

        # Якщо нічого не задано - повертаємо всві продукти
        else:
            productsCursor = mongo.db.products.find()
            products = [
                {
                    "_id": str(product["_id"]),
                    "name": product.get("name", "No name"),
                    "description": product.get("description", "No description"),
                    "quantity": product.get("quantity", "0"),
                    "price": product.get("price", "No price")
                }
                for product in productsCursor
            ]
            return jsonify({'products': products, 'message': 'Усі продукти'}), 200

    except Exception as e:
        return jsonify({'error': 'Помилка при отриманні даних', 'details': str(e)}), 500