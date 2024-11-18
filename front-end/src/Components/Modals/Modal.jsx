import iconClose from './close-icon.svg';
import './Modal.css';
import { useRef } from 'react';
import { Transition } from 'react-transition-group';

export default function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const onWrapperClick = (event) => {
    if (event.target.classList.contains('modal--wrapper')) onClose();
  };

  return (
    <>
      <Transition
        in={isOpen}
        timeout={350}
        unmountOnExit={true}
        nodeRef={modalRef}
      >
        {(state) => (
          <div ref={modalRef} className={`modal modal--${state}`}>
            <div className="modal--wrapper" onClick={onWrapperClick}>
              <div className="modal--content">
                <button
                  className="modal--close-btn"
                  onClick={() => onClose()}
                >
                  <img src={iconClose} alt="Close icon"/>
                </button>
                {children}
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
}