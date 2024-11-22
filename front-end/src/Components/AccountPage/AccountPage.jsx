import { useContext, useState, useEffect } from "react";
import { Context } from "../../App";
import "./AccountPage.css";
import Checkbox from "../UI/Checkbox/Checkbox";
import { AuthApi } from "../../api/AuthApi";
import ErrorPopup from "../Modals/ErrorPopup/ErrorPopup";
import VerificationSection from "./VerificationSection";
import DeliveryDetailsSection from "./DeliveryDetailsSection";
import MainInformationSection from "./MainInformationSection";

export default function AccountPage() {
    const { user } = useContext(Context);

    const [verificationCode, setVerificationCode] = useState("");
    const [errorPopupIsOpen, setErrorPopupIsOpen] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');
    const [showPaymentDetails, setShowPaymentDetails] = useState(false)
    
    return (
        <>
            <div className="account-page">
                <h1>Account</h1>
                {user && !user.isVerified && (
                    <VerificationSection
                        user={user}
                        verificationCode={verificationCode}
                        setVerificationCode={setVerificationCode}
                        setErrorPopupIsOpen={setErrorPopupIsOpen}
                        setErrorPopupMessage={setErrorPopupMessage}
                    />
                )}
                {user ? (
                    <form className="account-form">
                        <div>
                            <MainInformationSection
                                user={user}
                                verificationCode={verificationCode}
                                setVerificationCode={setVerificationCode}
                                setErrorPopupIsOpen={setErrorPopupIsOpen}
                                setErrorPopupMessage={setErrorPopupMessage}
                            />

                            <div className="form-section">
                                <h2>Modify password</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="current-password">Current password</label>
                                        <input
                                            className="text-input"
                                            type="password"
                                            id="current-password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="new-password">New password</label>
                                        <input
                                            className="text-input"
                                            type="password"
                                            id="new-password"
                                        />
                                    </div>
                                </div>
                                <Checkbox label="Show password" />
                            </div>
                        </div>

                        <div>
                            <DeliveryDetailsSection 
                                user={user}
                                verificationCode={verificationCode}
                                setVerificationCode={setVerificationCode}
                                setErrorPopupIsOpen={setErrorPopupIsOpen}
                                setErrorPopupMessage={setErrorPopupMessage}
                            />

                            <div className="form-section">
                                <h2>Payment details</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="card-number">Card number</label>
                                        <input
                                            className="text-input"
                                            type="text"
                                            id="card-number"
                                            value={user.cardNumber || ""}
                                            placeholder="1111 1111 1111 1111"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="expiration-date">Expiration date</label>
                                        <input
                                            className="text-input"
                                            type="text"
                                            id="expiration-date"
                                            value={user.cardDate || ""}
                                            placeholder="01/30"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cvv">CVV</label>
                                        <input
                                            className="text-input"
                                            type="text"
                                            id="cvv"
                                            value={user.cardCVV || ""}
                                            placeholder="***"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="button" className="btn">
                                Save details
                            </button>
                        </div>
                    </form>
                ) : (
                    <p>User data not available</p>
                )}
            </div>
            <ErrorPopup
                isOpen={errorPopupIsOpen}
                onClose={() => setErrorPopupIsOpen(false)}
                error={errorPopupMessage}
            />
        </>
    );
}