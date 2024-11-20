import { useState } from 'react';
import ItemModal from '../Modals/ItemModal/ItemModal';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import './Card.css';
import CardLabel from './CardLabel';
import CardInfo from './CardInfo';

export default function Card(itemData) {
  const [itemModalIsOpen, setItemModalOpen] = useState(false);

  return (
    <>
      <div className="card">
        <CardLabel unitsLeft={itemData.quantity}/>
        <img src={`/images/${itemData.img}`} className="card--image" alt={itemData.name}/>
        <CardInfo itemData={itemData}/>
        <div className="card--btn-group">
          <AddToCartButton itemData={itemData}/>
          <button
            onClick={() => setItemModalOpen(true)}
            className="btn"
          >
            View details
          </button>
        </div>
      </div>
      <ItemModal
        isOpen={itemModalIsOpen}
        onClose={() => setItemModalOpen(false)}
        itemData={itemData}
      />
    </>
  );
}
