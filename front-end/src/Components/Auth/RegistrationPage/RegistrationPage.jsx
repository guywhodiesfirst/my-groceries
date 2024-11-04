import React, { useState } from 'react';
import "./RegistrationPage.css"
import ErrorPopup from '../../Modals/ErrorPopup/ErrorPopup';

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const [errorPopupIsOpen, setErrorPopupIsOpen] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(formData.password !== formData.passwordConfirm) {
            setErrorPopupIsOpen(true)
            setErrorPopupMessage("Password fields don't match!")
            return
        }

        try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
        } else {
            const errorData = await response.json();
            setErrorPopupIsOpen(true)
            setErrorPopupMessage(errorData.message);
        }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Сталася помилка під час реєстрації.');
        }
    };

    const allFieldsFilled = Object.values(formData).every((field) => field.trim() !== "");

    return (
        <>
            <div className="registration-page">
                <div className="registration--form-container">
                    <h2 className="form--header">Sign up</h2>
                    <form className="registration--form" autoComplete="off" onSubmit={handleSubmit}>
                        <div className="registration--form-block">   
                            <input className="text-input" type="text" name="name" placeholder="First name" onChange={handleChange} required />
                            <input className="text-input" type="text" name="surname" placeholder="Last name" onChange={handleChange} required />
                        </div>
                        <input className="text-input" type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        <input className="text-input" type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
                        <div className="registration--form-block">
                            <input className="text-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                            <input className="text-input" type="password" name="passwordConfirm" placeholder="Confirm password" onChange={handleChange} required />
                        </div>
                        <div className="registration--btn-container"> 
                            <button type="submit" className="btn registration--btn" disabled={!allFieldsFilled}>Sign up</button>
                        </div>
                    </form>
                </div>
            </div>
            <ErrorPopup 
                isOpen={errorPopupIsOpen}
                onClose={() => setErrorPopupIsOpen(false)}
                error={errorPopupMessage}
            />
        </>
    );
};