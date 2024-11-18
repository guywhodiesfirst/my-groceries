import './ShoppingCart.css';
import '../Modal.css';
import ShoppingCartOrderList from './ShoppingCartOrderList';
import Modal from '../Modal';

export default function ShoppingCart({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ShoppingCartOrderList/>
    </Modal>
  );
}