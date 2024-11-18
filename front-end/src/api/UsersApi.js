import { client } from './client.js';

export class UsersApi {
  static getUsers(userType) {
    return client(`admin/users?userType=${userType}`, {
      method: 'GET',
    });
  }

  static async changeRoles(user) {
    await client(`admin/users`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    });
  }

  static async deleteUser(userId) {
    await client(`admin/users`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    })
  }
}