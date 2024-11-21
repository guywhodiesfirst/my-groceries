import { useContext } from "react";
import { Context } from "../../App";

export default function AddToCartButton({ itemData }) {
    const { setOrders } = useContext(Context);

    const addToOrder = (item) => {
        setOrders((prevOrders) => {
            const isInArray = prevOrders.some((element) => element.id === item.id);
            if (!isInArray) {
                return [...prevOrders, item];
            }
            return prevOrders;
        });
    };

    return (
        <button
            onClick={() => addToOrder(itemData)}
            className="btn"
        >
            Add to cart
        </button>
    );
}
