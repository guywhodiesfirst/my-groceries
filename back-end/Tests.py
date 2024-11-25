import requests
import unittest


class TestAPIEndpoints(unittest.TestCase):

    def setUp(self): # Ініціалізація зміних для перевірки функцій
        self.base_url = "http://127.0.0.1:5000"
        self.loginData = {"email": "example10@gmail.com", "password": "0000"}
        self.bearerToken = self.getBearerToken()


# Функція для тестування можливості авторизації
    def getBearerToken(self):
        url = f"{self.base_url}/login"
        try:
            response = requests.post(url, json=self.loginData)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Помилка авторизації: статус-код {response.status_code}")

            response_data = response.json()
            bearerToken = response_data.get("access_token")
            self.assertIsNotNone(bearerToken, "Токен не було отримано")
            return bearerToken
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запита: {e}")
    def testLogin(self):
        self.assertIsNotNone(self.bearerToken, "Не вдалось отримати токен")

    # Функція для тестування можливості отримання всього списку користувачів
    def testAdminUsersAll(self):
        url = f"{self.base_url}/admin/users"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}

        try:
            response = requests.get(url, headers=headers)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості отримання списку адміністраторів
    def testAdminUsersAdmin(self):
        url = f"{self.base_url}/admin/users"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}

        try:
            queryParams = {"userType": "admin"}
            response = requests.get(url, headers=headers, params=queryParams)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості отримання списку заблокованих користувачів
    def testAdminUsersBlocked(self):
        url = f"{self.base_url}/admin/users"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}

        try:
            queryParams = {"userType": "blocked"}
            response = requests.get(url, headers=headers, params=queryParams)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості отримання списку кур'єрів
    def testAdminUsersRunner(self):
        url = f"{self.base_url}/admin/users"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}

        try:
            queryParams = {"userType": "runner"}
            response = requests.get(url, headers=headers, params=queryParams)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості зміни рівня доступа
    def testAdminUsersAccessLevel(self):
        url = f"{self.base_url}/admin/users"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}
        try:
            response = requests.patch(url, headers=headers, json={"userId": "672a579b74d698604d84bb9a", "admin": True, "runner": True})
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості додавання товару до бази
    def testAdminUsersProductCreate(self):
        url = f"{self.base_url}/admin/product"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}
        try:
            response = requests.post(url, headers=headers, json={"name": "unittest", "price": 100, "quantity": 1, "category": "testCat","description": "testDesc", "image": "" } )
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 201, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості видалення товару з бази
    # Ця функція відправляє неіснуючий id та перевіряє щоб програма його не видалила
    def testAdminUsersProductDelete(self):
        url = f"{self.base_url}/admin/product"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}
        try:
            response = requests.delete(url, headers=headers,json={"_id": "0000d00c0eacb0a54cac6770"})
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 404, f"Тест виконався коректно")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості видалення товару з бази
    #Знаходить товар з категорії testCat та видаляє перший у списку
    def testAdminUsersProductDeleteAlternative(self):
        import json
        url = f"{self.base_url}/admin/product"
        urlToGet = f"{self.base_url}/products"
        headers = {"Authorization": f"Bearer {self.bearerToken}"}
        try:
            data = requests.get(urlToGet)
            data = data.json()
            firstID = data["products"][0]["_id"]
            response = requests.delete(url, headers=headers,json={"_id": firstID})
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався коректно")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості витягу всіх категорій
    def testProuctCategoryList(self):
        url = f"{self.base_url}/products/category"
        try:
            response = requests.get(url)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості витягу товару по id
    def testProductByID(self):
        url = f"{self.base_url}/products/6740105e68acda1d9e5f43fe"
        try:
            response = requests.get(url)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості витягу товару по його ім'я
    def testProductByName(self):
        url = f"{self.base_url}/products?name=hydrogen bomb"
        try:
            response = requests.get(url)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")

    # Функція для тестування можливості витягу товару по його категорії
    def testProductByCategory(self):
        url = f"{self.base_url}/products?category=weapons of mass destruction"
        try:
            response = requests.get(url)
            print(f"Запит відправлено на: {response.url}")
            print(f"Відповідь: {response.text}")
            self.assertEqual(response.status_code, 200, f"Тест виконався з помилкою: статус-код {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.fail(f"Помилка при виконанні запиту: {e}")


    def tearDown(self):
        self.bearerToken = None


if __name__ == '__main__':
    unittest.main()
