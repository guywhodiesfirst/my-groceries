import { useContext, useState } from "react";
import { Context } from "../../App";
import "./AccountPage.css";
import Checkbox from "../UI/Checkbox/Checkbox";
import ErrorPopup from "../Modals/ErrorPopup/ErrorPopup";
import VerificationSection from "./VerificationSection";
import DeliveryDetailsSection from "./DeliveryDetailsSection";
import MainInformationSection from "./MainInformationSection";
import PaymentDetailsSection from "./PaymentDetailsSection";

export default function AccountPage() {
    const { user } = useContext(Context);

    const [verificationCode, setVerificationCode] = useState("");
    const [errorPopupIsOpen, setErrorPopupIsOpen] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');
    
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
                                setErrorPopupIsOpen={setErrorPopupIsOpen}
                                setErrorPopupMessage={setErrorPopupMessage}
                            />

                            <PaymentDetailsSection 
                                user={user}
                                setErrorPopupIsOpen={setErrorPopupIsOpen}
                                setErrorPopupMessage={setErrorPopupMessage}
                            />
                        </div>
                    </form>
                ) : (
                    <h3>Loading...</h3>
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