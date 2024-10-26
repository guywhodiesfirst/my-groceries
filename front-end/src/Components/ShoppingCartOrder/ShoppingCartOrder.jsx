import './ShoppingCartOrder.css'

export default function ShoppingCartOrder({ itemData }) { 
    return(
        <div className="order--item">
            <img src={`/images/${itemData.img}`} className="order--image" alt={itemData.title} />
            <div className='order--item-info'>
                <p className='order--item-title'>{itemData.title}</p>
                <p className='order--item-price'>{itemData.price} UAH</p>
            </div>
        </div>
    )
}