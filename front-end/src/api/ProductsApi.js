import { client } from './client.js';

export class ProductsApi {
  static async getProducts({ category, name } = {}) {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (name) queryParams.append('name', name);

    const queryString = queryParams.toString();
    const url = queryString ? `products?${queryString}` : 'products';

    const response = await client(url, {
      method: 'GET',
    });

    return response.error ? [] : response.products;
  }

  static async getCategories() {
    const data = await client('products/category', {
      method: 'GET',
    });

    return data.categories;
  }

  static async createProduct(product) {
    return client('admin/product', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  static async updateProduct(product) {
    await client('/admin/product', {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  static async deleteProduct(id) {
    await client('admin/product', {
      method: 'DELETE',
      body: JSON.stringify({ _id: id }),
    })
  }

  static async getStats() {
    return client('admin/statistics', {
      method: 'GET',
    });
  }
}