import { useContext, useEffect, useState } from "react"
import { Context } from "../../../App"
import './ShoppingCart.css'
import ShoppingCartOrder from '../../ShoppingCartOrder/ShoppingCartOrder';
import { CartApi } from "../../../api/CartApi";

export default function ShoppingCartOrderList() {
    const [orders, setOrders] = useState([])
    const getOrders = async () => {
        const cart = await CartApi.getCart()
        console.log(cart)
        setOrders(cart)
    }

    useEffect(() => {
        getOrders().then()
    }, [])
    
    const handleRemoveOrder = async (productId) => {
        await CartApi.removeFromCart({ productId: productId });
        getOrders()
    }

    const handleQuantityChange = async (productId, quantityDiff) => {
        console.log(productId)
        await CartApi.updateQuantity(productId, quantityDiff);
    }

    return(
        <>
            <p className='shopping-cart--title poppins'>Cart</p>
            <div className='shopping-cart--order-list'>
                { orders ? (
                    <>
                        {orders.map((order, index) => (
                            <ShoppingCartOrder key={index} itemData={order} handleRemove={handleRemoveOrder} onQuantityChange={handleQuantityChange}/>
                        ))}
                        <button className="btn" style={{marginTop: "12px", float: "right"}}>Proceed to payment</button>
                    </>
                ) : (
                    <p>Here your cart orders will be displayed</p>
                )}
            </div>
        </>
    )
}
