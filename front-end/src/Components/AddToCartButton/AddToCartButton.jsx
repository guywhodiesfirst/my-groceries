import { useContext } from "react";
import { Context } from "../../App";
import { CartApi } from "../../api/CartApi";

export default function AddToCartButton({ itemData }) {
    const handleAddToCart = async(e) => {
        try {
            const response = await CartApi.addToCart({ productId: itemData._id });

            if (response.error) {
                alert(response.message);
            } else {
                console.log("Продукт додано до кошика");
            }
        } catch (e) {
            alert("Неможливо додати продукт до кошика. Спробуйте пізніше.");
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            className="btn"
            disabled={itemData.quantity < 1}
        >
            Add to cart
        </button>
    );
}
