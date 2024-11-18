import './ErrorPopup.css';
import Modal from '../Modal';
import errorIcon from './error_icon.png';

export default function ErrorPopup({ isOpen, onClose, error }) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="error--wrapper">
        <img src={errorIcon} className="error--icon" alt="Error icon"/>
        <div className="error--content">
          <p>{error}</p>
        </div>
      </div>
    </Modal>
  );
}