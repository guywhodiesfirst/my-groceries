import React, { useState, useContext } from 'react';
import "./RegistrationPage.css"
import "../Auth.css"
import ErrorPopup from '../../Modals/ErrorPopup/ErrorPopup';
import { useNavigate } from 'react-router';
import { Context } from '../../../App';

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const navigate = useNavigate()
    const {isAuthenticated, setIsAuthenticated} = useContext(Context);
    const [verificationCode, setVerificationCode] = useState('')
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [errorPopupIsOpen, setErrorPopupIsOpen] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('')


    const handleVerificationCodeChange = (event) => {
        setVerificationCode(event.target.value)
    }

    const sendVerificationCode = async () => {
        try {
            const response = await fetch('http://localhost:5000/request_verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email}),
            })
            const data = await response.json()
            if(response.ok) {
                setIsCodeSent(true)
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            setErrorPopupMessage(error.message)
            setErrorPopupIsOpen(true)
        }
    }

    const verifyCode = async () => {
        try {
            const response = await fetch('http://localhost:5000/verify_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    code: verificationCode
                })
            })

            const data = await response.json()
            if(response.ok) {
                alert(response.message)
            }
        } catch(error) {
            setErrorPopupMessage(error.message)
            setErrorPopupIsOpen(true)
        }
    }

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
            setErrorPopupIsOpen(true)
            setErrorPopupMessage('Error occured during registration.');
        }

        sendVerificationCode()
    };

    const allFieldsFilled = Object.values(formData).every((field) => field.trim() !== "");

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
            {isCodeSent && (
                <div className="verification-container">
                    <input type="text" placeholder="Enter Verification Code" value={verificationCode} onChange={handleVerificationCodeChange} required />
                    <button onClick={verifyCode}>Verify Code</button>
                </div>
            )}
            <ErrorPopup 
                isOpen={errorPopupIsOpen}
                onClose={() => setErrorPopupIsOpen(false)}
                error={errorPopupMessage}
            />
        </>
    );
};