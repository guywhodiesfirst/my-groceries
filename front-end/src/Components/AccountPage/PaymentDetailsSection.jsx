import { useState } from "react";
import Checkbox from "../UI/Checkbox/Checkbox";

export default function PaymentDetailsSection({user}) {
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    return (
        <div className="form-section">
            <h2>Payment details</h2>
            <Checkbox 
                label="Add payment details"
                checked={showAddress}
                onChange={() => setShowAddress(!showAddress)}
            />
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
    )
}