import './ItemModal.css';
import ItemModalInfo from './ItemModalInfo';
import Modal from '../Modal';

export default function ItemModal({ isOpen, onClose, itemData }) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal--item-wrapper">
        <div>
          <img src={itemData.image} className="modal--image" alt={itemData.name}/>
        </div>
        <ItemModalInfo itemData={itemData}/>
      </div>
    </Modal>
  );
}