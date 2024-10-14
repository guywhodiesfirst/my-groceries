import iconClose from '../close-icon.svg'
import './ShoppingCart.css'
import '../Modal.css'
import { useContext, useRef } from 'react';
import { Transition } from 'react-transition-group'; 
import { Context } from '../../../App';
import ShoppingCartOrder from '../../ShoppingCartOrder/ShoppingCartOrder';

export default function ShoppingCart({ isOpen, onClose }) {
    const [orders, setOrders] = useContext(Context)
    const modalRef = useRef(null); 
    const onWrapperClick = (event) => {
        if(event.target.classList.contains("modal--wrapper")) onClose()
    }
    return (
        <>
            <Transition 
                in={isOpen} 
                timeout={350} 
                unmountOnExit={true} 
                nodeRef={modalRef} 
            >
                {(state) => (
                    <div ref={modalRef} className={`modal modal--${state}`}>
                        <div className="modal--wrapper" onClick={onWrapperClick}>
                            <div className="modal--content">    
                                <p className='shopping-cart--title poppins'>Cart</p>
                                <button 
                                    className="modal--close-btn"
                                    onClick={() => onClose()}
                                >
                                    <img src={iconClose} alt="Close icon" />
                                </button>
                                <div className='shopping-cart--order-list'>
                                    {orders.length === 0 ? (
                                        <p>Here your cart orders will be displayed</p>
                                    ) : (
                                        orders.map((order, index) => (
                                            <ShoppingCartOrder key={index} itemData={order} />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
}