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

    productId = request.json.get('productId')
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
