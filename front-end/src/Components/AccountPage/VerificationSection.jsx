import React from "react";
import { AuthApi } from "../../api/AuthApi";

export default function VerificationSection({
    user,
    verificationCode,
    setVerificationCode,
    setErrorPopupIsOpen,
    setErrorPopupMessage,
}) {
    const handleVerificationSubmit = async (event) => {
        event.preventDefault();
        const result = await AuthApi.verifyCode(user.email, verificationCode);

        if (!result.success) {
            setErrorPopupIsOpen(true);
            setErrorPopupMessage(result.message);
        } else {
            alert(result.message);
        }
    };

    const handleResendCode = async () => {
        try {
            const result = await AuthApi.sendVerificationCode(user.email);
            if (!result.success) {
                setErrorPopupIsOpen(true);
                setErrorPopupMessage(result.message);
            } else {
                alert(result.message);
            }
        } catch (error) {
            setErrorPopupIsOpen(true);
            setErrorPopupMessage("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="verification-section">
            <h2>Account Not Verified</h2>
            <p>Your account is not verified yet. Please enter the verification code sent to your email: {$user.email}.</p>
            <form onSubmit={handleVerificationSubmit}>
                <div className="form-group">
                    <label htmlFor="verification-code">Verification Code</label>
                    <input
                        className="text-input"
                        type="number"
                        id="verification-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter verification code"
                    />
                </div>
                <div className="account--btn-container">
                    <button type="button" className="btn" onClick={handleResendCode}>
                        Resend code
                    </button>
                    <button
                        type="submit"
                        className="btn"
                        disabled={!verificationCode.trim()}
                    >
                        Verify Account
                    </button>
                </div>
            </form>
        </div>
    );
}
