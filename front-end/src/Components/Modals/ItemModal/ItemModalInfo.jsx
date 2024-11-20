import './ItemModal.css'
import AddToCartButton from '../../AddToCartButton/AddToCartButton';

export default function ItemModalInfo({itemData}) {
    return(
        <div className='modal--item-info'>
            <p><span className='bold noto-sans'>Title: </span>{itemData.name}</p>
            <p><span className='bold noto-sans'>Description: </span>{itemData.description}</p>
            <p><span className='bold noto-sans'>Category: </span>{itemData.category}</p>
            <p><span className='bold noto-sans'>Price: </span>{itemData.price} UAH</p>
            <p><span className='bold noto-sans'>Left in stock: </span>{itemData.quantity}</p>
            <AddToCartButton itemData={itemData} />
        </div>
    )
}