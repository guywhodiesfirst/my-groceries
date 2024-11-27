import { useState } from "react";
import Checkbox from "../UI/Checkbox/Checkbox";
import { AuthApi } from "../../api/AuthApi";

export default function PaymentDetailsSection({
    user,
    setErrorPopupIsOpen,
    setErrorPopupMessage, 
}) {
    const [showPaymentDetails, setShowPaymentDetails] = useState(!!user.cardNumber || !!user.cardDate || !!user.cardCVV);
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardDate: '',
        cardCVV: '',
    });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCardData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const allFieldsFilled = Object.values(cardData).every((field) => field.trim() !== '');

    const handleSavePaymentDetails = async (event) => {
        event.preventDefault();
        if (allFieldsFilled) {
            const updatedUser = { ...user, cardNumber: cardData.cardNumber, cardDate: cardData.cardDate, cardCVV: cardData.cardCVV, paymentMethod: selectedPaymentMethod }; 
            const result = await AuthApi.update(updatedUser);
            if (!result.success) {
                setErrorPopupIsOpen(true);
                setErrorPopupMessage(result.message);
            } else {
                alert(result.message); 
            }
        } else {
            alert('Please fill all fields.'); 
        }
    };

    return (
        <>
            <Checkbox
                label="Add payment details"
                defaultChecked={showPaymentDetails}
                onChange={() => setShowPaymentDetails((prev) => !prev)}
            />
            {showPaymentDetails &&
            <div className="form-section">
                <h2>Payment details</h2>
                <div className='dropdown-container'>
                    <label htmlFor="delivery-dropdown">Select a payment method:</label>
                    <select id="delivery-dropdown" value={selectedPaymentMethod} onChange={handlePaymentMethodChange}>
                        <option value="card">Card</option>
                        <option value="apple-pay">Apple Pay</option>
                        <option value="google-pay">Google Pay</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="card-number">Card number</label>
                        <input
                            className="text-input"
                            type="text"
                            id="card-number"
                            value={cardData.cardNumber || ""}
                            placeholder="1111 1111 1111 1111"
                            name="cardNumber"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiration-date">Expiration date</label>
                        <input
                            className="text-input"
                            type="text"
                            id="expiration-date"
                            value={cardData.cardDate || ""}
                            placeholder="01/30"
                            name="cardDate"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvv">CVV</label>
                        <input
                            className="text-input"
                            type="text"
                            id="cvv"
                            value={cardData.cardCVV || ""}
                            placeholder="***"
                            name="cardCVV"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button type="submit" className="btn" onClick={handleSavePaymentDetails}>
                    Save payment details
                </button>
            </div>
            }
        </>
    )
}