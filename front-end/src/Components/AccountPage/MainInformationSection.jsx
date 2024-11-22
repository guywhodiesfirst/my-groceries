import { useState } from "react";
import { AuthApi } from "../../api/AuthApi";

export default function MainInformationSection({ user }) {
    const [mainInfo, setMainInfo] = useState({
        phoneNumber: user.phoneNumber || '',
        name: user.name || '',
        surname: user.surname || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMainInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveMainInfo = async (event) => {
        event.preventDefault();
        const updatedUser = { ...user, name: mainInfo.name, surname: mainInfo.surname, phoneNumber: mainInfo.phoneNumber }; 
        const result = await AuthApi.update(updatedUser);
        if (!result.success) {
            setErrorPopupIsOpen(true);
            setErrorPopupMessage(result.message);
        } else {
            alert(result.message); 
        }
    };

    return (
        <div className="form-section">
            <h2>Main information</h2>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="first-name">First name</label>
                    <input
                        className="text-input"
                        type="text"
                        id="first-name"
                        value={mainInfo.name}  
                        name="name"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last-name">Last name</label>
                    <input
                        className="text-input"
                        type="text"
                        id="last-name"
                        value={mainInfo.surname} 
                        name="surname"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone</label>
                    <input
                        className="text-input"
                        type="text"
                        id="phoneNumber"
                        value={mainInfo.phoneNumber} 
                        name="phoneNumber"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        className="text-input"
                        type="email"
                        id="email"
                        value={user.email || ""}
                        readOnly
                    />
                </div>
            </div>
            <button type="button" className="btn" onClick={handleSaveMainInfo}>
                Save main information
            </button>
        </div>
    );
}