import './Card.css'

export default function CardInfo({itemData}) {
    return(
        <div className="card--info">
            <div className="card--stats">
                <span className="card--price bold noto-sans">{itemData.price} UAH</span>
                <span className="gray noto-sans"> • </span>
                <img src="../images/star.png" className="card--star" alt="Star rating" />
                <span className='noto-sans' style={{ marginLeft: "4px" }}>{itemData.stats.rating}</span>
                <span className="gray noto-sans">({itemData.stats.reviewCount})</span>
            </div>
            <p className="card--title">{itemData.title}</p>
        </div>
    )
}