import { client } from "./client.js";

export class AuthApi {
    static async sendVerificationCode(email) {
        try {
            const response = await client('request_verification', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
    
            if (response.error) {
                return { success: false, message: response.message }
            }
    
            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    static async verifyCode(email, code) {
        const response = await client('verify_code', {
          method: 'POST',
          body: JSON.stringify({ email, code }),
        });
    
        return response.error
          ? { success: false, message: response.message }
          : { success: true, message: response.message };
      }

    static async register(formData) {
        if (formData.password !== formData.passwordConfirm) {
            return {
                success: false,
                message: "Password fields don't match!",
            };
        }

        try {
            const response = await client('register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            if (response.error) {
                return {
                    success: false,
                    message: response.message,
                };
            }

            await this.sendVerificationCode(formData.email);

            return {
                success: true,
                message: response.message,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error occurred during registration. ' + error.message,
            };
        }
    }

    static async update(userData) {
        try {
            const response = await client('profile', {
                method: 'PUT',
                body: JSON.stringify(userData),
            });

            if (response.error) {
                return { success: false, message: response.message };
            }

            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, message: 'Error occurred during update. ' + error.message };
        }
    }
}