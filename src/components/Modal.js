import React from "react";
import ReactDOM from "react-dom";
import "../styles/ScoreTable.css";

const Modal = (props) => {
  return (
    props.modalTrigger ?
      ReactDOM.createPortal(
      <div className="modal-overlay" onClick={props.closeModal}>
        <div className="modal-div" onClick={props.closeModal}>
          {props.message}
          <hr />
          <button onClick={props.submitModal}>Do It</button>  
          <button onClick={props.closeModal}>Cancel</button>  
        </div>
      </div>,
      document.body
    ) : null
  );
};

export default Modal;
