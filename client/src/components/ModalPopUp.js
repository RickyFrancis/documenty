import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';

import { useDispatch, useSelector } from 'react-redux';
import {
  getSingleDocument,
  addEditor,
  removeEditor,
} from '../actions/documentActions';

const ModalPopUp = ({ show, handleClose, id }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const documentDetails = useSelector((state) => state.documentDetails);
  const { loading, error, document } = documentDetails;

  const documentAddEditor = useSelector((state) => state.documentAddEditor);
  const {
    loading: loadingAddEditor,
    error: errorAddEditor,
    success: successAddEditor,
  } = documentAddEditor;

  const documentRemoveEditor = useSelector(
    (state) => state.documentRemoveEditor
  );
  const {
    error: errorRemoveEditor,
    success: successRemoveEditor,
  } = documentRemoveEditor;

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      dispatch(getSingleDocument(id));
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  const addEditorHandler = (e, email, documentId) => {
    e.preventDefault();
    dispatch(addEditor(email, documentId));
  };

  const removeEditorHandler = (e, email, documentId) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this editor?')) {
      dispatch(removeEditor(email, documentId));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add or Remove Document Editors</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Form
              onSubmit={(e) => {
                addEditorHandler(e, email, document._id);
              }}
            >
              <InputGroup className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
                <InputGroup.Append>
                  <Button type="submit" variant="primary">
                    Add &nbsp;
                    <Spinner
                      animation="border"
                      size="sm"
                      hidden={!loadingAddEditor}
                    />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
            {errorAddEditor && (
              <Message variant="danger" timeOut={6000}>
                {errorAddEditor}
              </Message>
            )}
            {errorRemoveEditor && (
              <Message variant="danger">{errorRemoveEditor}</Message>
            )}
            {successAddEditor && <Message>Editor Added!</Message>}
            {successRemoveEditor && <Message>Editor Removed!</Message>}
            <ListGroup variant="flush">
              {document.editors && document.editors.length > 0 && (
                <ListGroup.Item
                  style={{ border: '1px solid rgba(255,255,255, 0.5)' }}
                >
                  Editors
                </ListGroup.Item>
              )}

              {document.editors && document.editors.length > 0 ? (
                document.editors.map((editor) => (
                  <ListGroup.Item
                    style={{
                      border: '1px solid rgba(255,255,255, 0.2)',
                    }}
                    key={editor._id}
                  >
                    {editor.email} &nbsp;
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => {
                        removeEditorHandler(e, editor.email, document._id);
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>This document has no editors</ListGroup.Item>
              )}
            </ListGroup>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={handleClose}>
          Done &nbsp; <i className="fas fa-check"></i>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPopUp;
