import AddToCartButton from '../../AddToCartButton/AddToCartButton';
import iconClose from '../close-icon.svg'
import '../Modal.css'
import './ItemModal.css'
import { useRef } from 'react';
import { Transition } from 'react-transition-group'; 

export default function ItemModal({ isOpen, onClose, itemData }) {
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
                                <button 
                                    className="modal--close-btn"
                                    onClick={() => onClose()}
                                >
                                    <img src={iconClose} alt="Close icon" />
                                </button>
                                <div className="modal--item-wrapper">
                                    <div>
                                        <img src={`/images/${itemData.img}`} className="modal--image" />
                                    </div>
                                    <div className='modal--item-info'>
                                        <p><span className='bold noto-sans'>Title: </span>{itemData.title}</p>
                                        <p><span className='bold noto-sans'>Description: </span>{itemData.description}</p>
                                        <p><span className='bold noto-sans'>Category: </span>{itemData.category}</p>
                                        <p><span className='bold noto-sans'>Price: </span>{itemData.price} UAH</p>
                                        <p><span className='bold noto-sans'>Left in stock: </span>{itemData.unitsLeft}</p>
                                        <AddToCartButton itemData={itemData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Transition>
        </>
    );
}