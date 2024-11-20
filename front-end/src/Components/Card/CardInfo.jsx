import './Card.css';

export default function CardInfo({ itemData }) {
  return (
    <div className="card--info">
      <div className="card--stats">
        <span className="card--price bold noto-sans">{itemData.price} UAH</span>
      </div>
      <p className="card--title">{itemData.name}</p>
    </div>
  );
}