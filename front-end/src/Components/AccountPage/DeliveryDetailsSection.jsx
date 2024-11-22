import { useEffect, useState } from "react";
import Checkbox from "../UI/Checkbox/Checkbox";
import { AuthApi } from "../../api/AuthApi";

export default function DeliveryDetailsSection({ 
    user,
    setErrorPopupIsOpen,
    setErrorPopupMessage, 
}) {
    const [showDeliveryDetails, setShowDeliveryDetails] = useState(!!user.deliveryPlace);
    const [addressData, setAddressData] = useState({
        region: '',
        city: '',
        street: '',
        postalCode: ''
    });

    const [fullAddress, setFullAddress] = useState(user.deliveryPlace || '');
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');

    const handleDeliveryMethodChange = (event) => {
        setSelectedDeliveryMethod(event.target.value);
    };

    const getAddressString = () => {
        return Object.values(addressData)
            .filter((value) => value.trim() !== '') 
            .join(', ');
    };

    useEffect(() => {
        if(allFieldsFilled) {
            const newFullAddress = getAddressString();
            setFullAddress(newFullAddress); 
        }
    }, [addressData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAddressData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const allFieldsFilled = Object.values(addressData).every((field) => field.trim() !== '');

    const handleSaveDeliveryDetails = async (event) => {
        event.preventDefault();
        if (allFieldsFilled) {
            const updatedUser = { ...user, deliveryPlace: fullAddress, deliveryMethod: selectedDeliveryMethod }; 
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
        <div className="form-section">
            <h2>Delivery Details</h2>
            <Checkbox
                label="Add delivery details"
                defaultChecked={showDeliveryDetails}
                onChange={() => setShowDeliveryDetails((prev) => !prev)}
            />

            {showDeliveryDetails && (
                <>
                    <div className='dropdown-container'>
                        <label htmlFor="delivery-dropdown">Select a delivery method:</label>
                        <select id="delivery-dropdown" value={selectedDeliveryMethod} onChange={handleDeliveryMethodChange}>
                            <option value="courier">Courier</option>
                            <option value="post-office">Post office</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="full-address">Full address</label>
                            <input
                                className="text-input"
                                type="text"
                                id="fullAddress"
                                value={fullAddress} 
                                placeholder="Kherson oblast, Nowheresville, Main street 73, apt. 14, 00000"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="region">Region</label>
                            <input
                                className="text-input"
                                type="text"
                                id="region"
                                name="region"
                                placeholder="Kherson oblast"
                                value={addressData.region}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City/town name</label>
                            <input
                                className="text-input"
                                type="text"
                                id="city"
                                name="city"
                                placeholder="Nowhereville"
                                value={addressData.city}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="street">Street address</label>
                            <input
                                className="text-input"
                                type="text"
                                id="street"
                                name="street"
                                placeholder="Main street, 73, apt. 14"
                                value={addressData.street}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="postal-code">Postal code</label>
                            <input
                                className="text-input"
                                type="number"
                                id="postal-code"
                                name="postalCode"
                                placeholder="00000"
                                value={addressData.postalCode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="button" className="btn" disabled={!allFieldsFilled} onClick={handleSaveDeliveryDetails}>
                        Save delivery details
                    </button>
                </>
            )}
        </div>
    );
}