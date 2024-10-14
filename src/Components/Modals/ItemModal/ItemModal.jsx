import './ItemModal.css'
import ItemModalInfo from './ItemModalInfo';
import Modal from '../Modal'

export default function ItemModal({ isOpen, onClose, itemData }) {
    
    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            modalContent={
            <div className="modal--item-wrapper">
                <div>
                    <img src={`/images/${itemData.img}`} className="modal--image" />
                </div>
                <ItemModalInfo itemData={itemData}/>
            </div>
        }/>
    );
}