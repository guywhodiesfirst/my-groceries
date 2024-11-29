import { useContext, useEffect, useState } from "react"
import { Context } from "../../../App"
import './ShoppingCart.css'
import ShoppingCartOrder from '../../ShoppingCartOrder/ShoppingCartOrder';
import { CartApi } from "../../../api/CartApi";

export default function ShoppingCartOrderList() {
    const [orders, setOrders] = useState([])
    const [totalSum, setTotalSum] = useState(0)

    const getOrders = async () => {
        const cart = await CartApi.getCart()
        setOrders(cart)
    }

    const getTotalSum = async () => {
        const sum = await CartApi.getCartSum()
        setTotalSum(sum)
    }

    useEffect(() => {
        const fetchCartData = async () => {
            await getOrders();
            await getTotalSum();
        };
    
        fetchCartData();
    }, [])
    
    const handleRemoveOrder = async (productId) => {
        await CartApi.removeFromCart({ productId: productId });
        getOrders()
        getTotalSum()
    }

    const handleQuantityChange = async (productId, quantityDiff) => {
        await CartApi.updateQuantity(productId, quantityDiff);
        getTotalSum()
    }

    return(
        <>
            <p className='shopping-cart--title poppins'>Cart</p>
            <div className='shopping-cart--order-list'>
                { orders.length > 0 ? (
                    <>
                        {orders.map((order, index) => (
                            <ShoppingCartOrder key={index} itemData={order} handleRemove={handleRemoveOrder} onQuantityChange={handleQuantityChange}/>
                        ))}
                        <div className="shopping-cart--summary">
                            <p className="total-sum">To pay: {totalSum} UAH</p>
                            <a href="/payment"><button className="btn shopping-cart--proceed-btn">Proceed to payment</button></a>
                        </div>
                        
                    </>
                ) : (
                    <p>Here your cart orders will be displayed</p>
                )}
            </div>
        </>
    )
}
