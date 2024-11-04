import React, { useState } from 'react';
import "./LoginPage.css"
import ErrorPopup from '../../Modals/ErrorPopup/ErrorPopup';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

        try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("access_token", data.access_token)
            alert("Ви успішно увійшли в систему!");
        } else {
            const errorData = await response.json();
            setErrorPopupIsOpen(true)
            setErrorPopupMessage(errorData.message);
        }
        } catch (error) {
            setErrorPopupIsOpen(true)
            setErrorPopupMessage('Error occured during authentification.');
        }
    };

    const allFieldsFilled = Object.values(formData).every((field) => field.trim() !== "");

    return (
        <>
            <div className="auth--page">
                <div className="auth--wrapper">
                    <div className="auth--form-container">
                        <h2 className="auth--form-header">Sign in</h2>
                        <form className="auth--form" autoComplete="off" onSubmit={handleSubmit}>
                            <input className="text-input" type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
                            <input className="text-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                            
                            <div className="auth--btn-container"> 
                                <button type="submit" className="btn auth--btn" disabled={!allFieldsFilled}>Sign in</button>
                            </div>
                        </form>
                        <p className='auth--paragraph'>Don't have an account? <a href='/register'>Sign up!</a></p>
                    </div>
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