// Modal.js
import React from 'react';
import { Modal } from 'react-bootstrap';

const ModalForm = ({ show, onHide, title, children }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalForm;