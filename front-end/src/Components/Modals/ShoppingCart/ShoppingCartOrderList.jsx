import { useContext } from "react"
import { Context } from "../../../App"
import './ShoppingCart.css'
import ShoppingCartOrder from '../../ShoppingCartOrder/ShoppingCartOrder';

export default function ShoppingCartOrderList() {
    
    const {orders, setOrders} = useContext(Context)
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
