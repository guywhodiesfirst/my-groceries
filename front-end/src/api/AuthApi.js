import { client } from "./client.js";

export class AuthApi {
    static async sendVerificationCode(email) {
        try {
            const response = await client('request_verification', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
    
            if (response.error) {
                throw new Error(response.message);
            }
    
            return { success: true };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    

    static async verifyCode(email, code) {
        try {
            const response = await client('verify_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            return { success: true, message: data.message };
        } catch (error) {
            throw new Error(error.message);
        }
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
}