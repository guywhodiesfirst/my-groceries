import re

from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

productRoutes = Blueprint('product', __name__)

@productRoutes.route('/productsCatalog', methods=['GET'])
def getProducts():
    from app import mongo
    products = mongo.db.products.find()
    productList = []
    for product in products:
        # Перетворення ObjectId у рядок
        product['_id'] = str(product['_id'])
        if int(product['quantity']) > 0:
            productList.append(product)
    return jsonify(productList), 200

@productRoutes.route('/product/getInform', methods=['GET'])
def getInformById():
    from app import mongo

    productId = request.json.get('product id')
    if not productId:
        return jsonify({"error": "ID продукту не надано"}), 400

    try:
        product = mongo.db.products.find_one({'_id': ObjectId(productId)})

        if not product:
            return jsonify({"error": "Продукт не знайдено"}), 404
        product['_id'] = str(product['_id'])
        # Повернення знайденого продукту у форматі JSON
        return jsonify(product), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@productRoutes.route('/product/getCategories', methods=['GET'])
def getCategories():
    from app import mongo
    try:
        categories = []
        categoriesCursor = mongo.db.products.find({}, {'category': 1})

        for product in categoriesCursor:
            category = product.get('category', [])
            if category not in categories:
                categories.append(category)

        return jsonify({'categories': categories, 'message': 'Пошук пройшов успішно'}), 200
    except Exception as e:
        return jsonify({'error': 'Помилка пошуку категорій', 'details': str(e)}), 500


@productRoutes.route('/product/getProdbyCat', methods=['GET'])
@jwt_required()
def getProductsByCategory():
    from app import mongo

    category = request.json.get('category')
    if not category:
        return jsonify({'message': 'Категорію не вказано'}), 400

    try:
        productsCursor = mongo.db.products.find({'category': category})
        products = [{"_id": str(product["_id"]), "name": product.get("name", "No name"),"description": product.get("description", "No description"),
                     "quantity": product.get("quantity", "0"),"price": product.get("price", "No price")} for product in productsCursor]

        if not  products:
            return jsonify({'message': 'Продуктів у цій категорії не знайдено'}), 404
    except Exception as e:
        return jsonify({'error': 'Помилка при отриманні продуктів', 'details': str(e)}), 500


@productRoutes.route('/product/getProdbyName', methods=['GET'])
@jwt_required()
def getProductsByName():
    from app import mongo

    nameSubstring = request.json.get('name')
    if not nameSubstring:
        return jsonify({'message': 'Потрібно вказати частину імені продукту'}), 400

    try:

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

        if products:
            return jsonify({'products': products, 'message': 'Продукти знайдено'}), 200
        else:
            return jsonify({'message': 'Продукти не знайдено'}), 404
    except Exception as e:
        return jsonify({'error': 'Помилка при отриманні продуктів', 'details': str(e)}), 500

