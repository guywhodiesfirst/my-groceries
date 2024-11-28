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
}