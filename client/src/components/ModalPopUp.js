import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroup } from 'react-bootstrap';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';

const ModalPopUp = ({ show, handleClose, addEditor }) => {
  const dispatch = useDispatch();

  const documentDetails = useSelector((state) => state.documentDetails);
  const {
    loading: loadingDocumentDetails,
    error: errorDocumentDetails,
    document,
  } = documentDetails;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush" className="text-center">
          {document.editor.length > 0 ? (
            document.editors.map((editor) => (
              <ListGroup.Item>{editor.email}</ListGroup.Item>
            ))
          ) : (
            <p>No Editor</p>
          )}
          {/* <ListGroup.Item>{document.owner.name}</ListGroup.Item> */}
          <ListGroup.Item>Hi</ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPopUp;
