import { useContext, useEffect, useState } from "react"
import { Context } from "../../../App"
import './ShoppingCart.css'
import ShoppingCartOrder from '../../ShoppingCartOrder/ShoppingCartOrder';
import { CartApi } from "../../../api/CartApi";

export default function ShoppingCartOrderList() {
    const [orders, setOrders] = useState([])
    const getOrders = async () => {
        const cart = await CartApi.getCart()
        setOrders(cart)
    }

    useEffect(() => {
        getOrders().then()
        console.log(orders)
    }, [])

    return(
        <>
            <p className='shopping-cart--title poppins'>Cart</p>
            <div className='shopping-cart--order-list'>
                {orders.length === 0 ? (
                    <p>Here your cart orders will be displayed</p>
                ) : (
                    <>
                        {orders.map((order, index) => (
                            <ShoppingCartOrder key={index} itemData={order} />
                        ))}
                        <button className="btn" style={{marginTop: "12px", float: "right"}}>Proceed to payment</button>
                    </>
                )}
            </div>
        </>
    )
}
