import re

from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

productRoutes = Blueprint('product', __name__)

@productRoutes.route('/products/category', methods=['GET'])
def getCategory():
    from app import mongo
    categories = []
    categoriesCursor = mongo.db.products.find({}, {'category': 1})

    for product in categoriesCursor:
        category = product.get('category', [])
        if category not in categories:
            categories.append(category)
    return jsonify({'categories': categories, 'message': 'Пошук пройшов успішно'}), 200

@productRoutes.route('/products', defaults={'product_id': None}, methods=['GET'])
@productRoutes.route('/products/<product_id>', methods=['GET'])
def getProducts(product_id):
    from app import mongo

    # Отримання параметрів
    category = request.args.get('category')
    nameSubstring = request.args.get('name')

    try:
        # Пошук продукта по ID
        if product_id:
            product = mongo.db.products.find_one({'_id': ObjectId(product_id)})

            if not product:
                return jsonify({"error": "Продукт не знайдено"}), 404

            product['_id'] = str(product['_id'])
            return jsonify({
                "_id": product["_id"],
                "name": product.get("name", "No name"),
                "description": product.get("description", "No description"),
                "quantity": product.get("quantity", "0"),
                "price": product.get("price", "No price"),
                "category": product.get("category", "No category")
            }), 200

        # Формування фільтру для запиту
        queryFilter = {}
        if category:
            queryFilter['category'] = category
        if nameSubstring:
            queryFilter['name'] = {'$regex': re.escape(nameSubstring), '$options': 'i'}

        # Виконання запиту з фільтром
        productsCursor = mongo.db.products.find(queryFilter)
        products = [
            {
                "_id": str(product["_id"]),
                "name": product.get("name", "No name"),
                "description": product.get("description", "No description"),
                "quantity": product.get("quantity", "0"),
                "price": product.get("price", "No price"),
                "category": product.get("category", "No category")
            }
            for product in productsCursor
        ]

        if not products:
            return jsonify({'message': 'Продукти не знайдено'}), 404

        return jsonify({'products': products, 'message': 'Продукти знайдено'}), 200

    except Exception as e:
        return jsonify({'error': 'Помилка при отриманні даних', 'details': str(e)}), 500
