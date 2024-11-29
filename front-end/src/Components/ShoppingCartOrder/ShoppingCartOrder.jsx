import { useState } from 'react';
import './ShoppingCartOrder.css';

export default function ShoppingCartOrder({ itemData, onQuantityChange, handleRemove }) {
    const [quantity, setQuantity] = useState(itemData.quantity || 1);

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(itemData.productId, 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange(itemData.productId, -1);
        }
    };

    const handleInputChange = (e) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        setQuantity(newQuantity);
        const quantityDiff = newQuantity - quantity
        onQuantityChange(itemData.productId, quantityDiff);
    };

    return (
        <div className="order--item">
            <img src={itemData.image} className="order--image" alt={itemData.name} />
            <div className="order--item-info">
                <p className="order--item-title">{itemData.name}</p>
                <p className="order--item-price">{(itemData.price * quantity).toFixed(2)} UAH</p>
                <div className="order--quantity-controls">
                    <button className="quantity--decrease btn" onClick={handleDecrease}>-</button>
                    <input
                        type="number"
                        className="quantity--input text-input"
                        value={quantity}
                        onChange={handleInputChange}
                        min="1"
                    />
                    <button className="quantity--increase btn" onClick={handleIncrease}>+</button>
                    <button className="btn remove-order" onClick={() => handleRemove(itemData.productId)}>✕</button>
                </div>
            </div>
        </div>
    );
}
