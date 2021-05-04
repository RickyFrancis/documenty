import React, { useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ModalPopUp from '../components/ModalPopUp';
import { DOCUMENT_DETAILS_RESET } from '../constants/documentConstants';

import { useDispatch, useSelector } from 'react-redux';
import { listDocuments, deleteDocument } from '../actions/documentActions';

const HomeScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [documentId, setDocumentId] = useState('');
  const handleClose = () => {
    setShow(false);
    dispatch({ type: DOCUMENT_DETAILS_RESET });
  };
  const handleShow = (id) => {
    setDocumentId(id);
    setShow(true);
  };

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
          {show && (
            <ModalPopUp show={show} handleClose={handleClose} id={documentId} />
          )}

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
