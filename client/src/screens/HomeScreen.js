import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidV4 } from 'uuid';
import {
  Form,
  Button,
  Row,
  Col,
  Table,
  ListGroup,
  Modal,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { DOCUMENT_DETAILS_RESET } from '../constants/documentConstants';

import { useDispatch, useSelector } from 'react-redux';
import {
  listDocuments,
  deleteDocument,
  getSingleDocument,
  addEditor,
  removeEditor,
} from '../actions/documentActions';

const HomeScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const documentDetails = useSelector((state) => state.documentDetails);
  const {
    loading: loadingDocumentDetails,
    error: errorDocumentDetails,
    document,
  } = documentDetails;

  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    dispatch({ type: DOCUMENT_DETAILS_RESET });
    setEmail('');
  };
  const handleShow = (id) => {
    dispatch(getSingleDocument(id));
    setShow(true);
  };

  const addEditorHandler = (e, email, documentId) => {
    e.preventDefault();
    dispatch(addEditor(email, documentId));
  };

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
    loading: loadingRemoveEditor,
    error: errorRemoveEditor,
    success: successRemoveEditor,
  } = documentRemoveEditor;

  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const documentList = useSelector((state) => state.documentList);
  const { loading, error, documents, page, pages } = documentList;

  const documentDelete = useSelector((state) => state.documentDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = documentDelete;

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo } = userRegister;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo: userInfoLogin } = userLogin;

  const redirect = '/login';

  useEffect(() => {
    if (!userInfoLogin) {
      history.push(redirect);
    } else {
      dispatch(listDocuments(keyword, pageNumber));
    }
  }, [
    dispatch,
    keyword,
    pageNumber,
    history,
    userInfo,
    redirect,
    userInfoLogin,
  ]);

  const returnDate = (date) => {
    return new Date(date).toString();
  };

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      dispatch(deleteDocument(id));
    }
  };

  const removeEditorHandler = (e, email, documentId) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this editor?')) {
      dispatch(removeEditor(email, documentId));
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>My Documents</h1>
        </Col>
        <Col className="text-right">
          <LinkContainer to={`/documents/${uuidV4()}`}>
            <Button className="my-3">
              <i className="fas fa-plus"></i> &nbsp; New Document
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add or Remove Document Editors</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {loadingDocumentDetails ? (
                <Loader />
              ) : errorDocumentDetails ? (
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
                    <Message variant="danger">{errorAddEditor}</Message>
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
                              removeEditorHandler(
                                e,
                                editor.email,
                                document._id
                              );
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>
                        This document has no editors
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              {/* <Button variant="secondary" onClick={handleClose}>
                Close
              </Button> */}
              <Button variant="primary" onClick={handleClose}>
                Done &nbsp; <i className="fas fa-check"></i>
              </Button>
            </Modal.Footer>
          </Modal>

          <Table striped bordered hover responsive variant="secondary">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Creation Date</th>
                <th>Last Update</th>
                <th>Owner</th>
                <th>Editors</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents && documents.length > 0 ? (
                documents.map((document) => (
                  <tr key={document._id}>
                    <td className="align-middle">
                      {/* <a href={`/documents/${document._id}`} className="m-1"> */}
                      {document.name}
                      {/* </a> */}
                    </td>
                    <td className="align-middle">
                      {returnDate(document.createdAt).substr(0, 16)}
                    </td>
                    <td className="align-middle">
                      {returnDate(document.updatedAt).substr(0, 16)}
                    </td>
                    <td className="align-middle">
                      {document.owner._id.toString() ===
                      userInfoLogin._id.toString()
                        ? 'Me'
                        : document.owner.email}
                    </td>
                    <td className="align-middle">
                      {document.owner._id.toString() ===
                        userInfoLogin._id.toString() && (
                        <Button
                          className="btn-sm"
                          onClick={() => handleShow(document._id)}
                          variant="light"
                        >
                          Editors
                        </Button>
                      )}
                    </td>

                    <td align="center">
                      <LinkContainer
                        to={`/documents/${document._id}`}
                        className="m-1"
                      >
                        <Button className="btn-sm">Open</Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm m-1"
                        onClick={() => deleteHandler(document._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No documents found. You may create a new one.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
