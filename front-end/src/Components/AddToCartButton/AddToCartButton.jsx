import { useContext } from "react";
import { Context } from "../../App";

export default function AddToCartButton({ itemData }) {
    const {orders, setOrders} = useContext(Context)
    const addToOrder = (item) => {
        let isInArray = false
        orders.forEach(element => {
            if(element.id === item.id)
                isInArray = true
        });
        
        if(!isInArray) setOrders([...orders, item]);
    }

    return(
        <button
            onClick={() => addToOrder(itemData)}
            className="btn"    
        >
            Add to cart
        </button>
    ) 
}