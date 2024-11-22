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
        return data.cartItems || []
    }

    static async addToCart(productId) {
        return client('cart', {
            method: 'POST',
            body: JSON.stringify(productId),
        });
    }
}