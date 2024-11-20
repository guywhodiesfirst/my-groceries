import './ShoppingCartOrder.css'

export default function ShoppingCartOrder({ itemData }) {
    console.log(itemData) 
    return(
        <div className="order--item">
            <img src={itemData.image} className="order--image" alt={itemData.title} />
            <div className='order--item-info'>
                <p className='order--item-title'>{itemData.name}</p>
                <p className='order--item-price'>{itemData.price} UAH</p>
            </div>
        </div>
    )
}