import React, { useState, useContext } from 'react';
import "./RegistrationPage.css";
import "../Auth.css";
import ErrorPopup from '../../Modals/ErrorPopup/ErrorPopup';
import { useNavigate } from 'react-router';
import { Context } from '../../../App';
import { AuthApi } from '../../../api/AuthApi.js';

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const navigate = useNavigate();
    const { isAuthenticated } = useContext(Context);
    const [errorPopupIsOpen, setErrorPopupIsOpen] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
    
        const result = await AuthApi.register(formData)
    
        if (!result.success) {
            setErrorPopupIsOpen(true);
            setErrorPopupMessage(result.message)
        } else {
            alert(result.message)
        }
    };

    const allFieldsFilled = Object.values(formData).every((field) => field.trim() !== '');

    return (
        <>
            {isAuthenticated && navigate('/catalog')}
            <div className="auth--page">
                <div className="auth--wrapper">
                    <div className="auth--form-container">
                        <h2 className="auth--form-header">Sign up</h2>
                        <form className="auth--form" autoComplete="off" onSubmit={handleSubmit}>
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
                            <div className="auth--btn-container">
                                <button type="submit" className="btn auth--btn" disabled={!allFieldsFilled}>Sign up</button>
                            </div>
                        </form>
                        <p className='auth--paragraph'>Already have an account? <a href='/login'>Sign in!</a></p>
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
}