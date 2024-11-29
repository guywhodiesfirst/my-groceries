import { client } from "./client.js";

export class CartApi {
    static async getCart() {
        const data = client('cart', {
            method: 'GET',
        })
        if (data.error) {
            console.log('error ', data.message)
            return []
        }
        return data || []
    }

    static async addToCart(productId) {
        return client('cart', {
            method: 'POST',
            body: JSON.stringify(productId),
        });
    }

    static async removeFromCart(productId) {
        return client('cart', {
            method: 'DELETE',
            body: JSON.stringify(productId)
        })
    }

    static async updateQuantity(productId, quantityDiff) {
        return client('cart', {
            method: 'PUT',
            body: JSON.stringify({
                productId: productId,
                quantityToAdd: quantityDiff
            })
        })
    }

    static async getCartSum() {
        const response = await client('cartSum', {
            method: 'GET'
        })
        if(response.error) {
            console.log('error', response.message)
            return 0
        }
        return response.totalSum || 0
    }

    static async confirmPayment(deliveryAddress, paymentMethod, orderDetails) {
        return client('checkout', {
            method: 'POST',
            body: JSON.stringify({
                deliveryAddress: deliveryAddress,
                paymentMethod: paymentMethod,
                orderDetails: orderDetails
            })
        })
    }
}