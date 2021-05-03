import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import ModalPopUp from '../components/ModalPopUp';
import { DOCUMENT_DETAILS_RESET } from '../constants/documentConstants';

const SAVE_INTERVAL_MS = 2000;

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }], // dropdown with defaults from theme
  [{ color: [] }, { background: [] }, 'blockquote'], // dropdown with defaults from theme

  ['bold', 'italic', 'underline'], // toggled buttons

  ['strike', { script: 'sub' }, { script: 'super' }], // superscript/subscript align

  ['image', 'code-block', 'clean'],
];
// const TOOLBAR_OPTIONS = [
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ font: [] }],
//   [{ list: 'ordered' }, { list: 'bullet' }],
//   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//   [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
//   [{ align: [] }],

//   ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//   ['image', 'blockquote', 'code-block'],

//   ['clean'], // remove formatting button
// ];

const TextEditor = ({ history }) => {
  const { id: documentId } = useParams();
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    dispatch({ type: DOCUMENT_DETAILS_RESET });
  };
  const handleShow = () => {
    setShow(true);
  };

  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userLogin.userInfo);

  if (!userInfo) {
    history.push(`/login?redirect=/documents/${documentId}`);
  }

  const [name, setName] = useState();
  const [alertStatus, setAlertStatus] = useState(false);
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io('http://127.0.0.1:5001/');
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Get and load document
  useEffect(() => {
    if (socket == null || quill == null || userInfo == null) return;

    socket.once('load-document', (document, name) => {
      if (document == null) {
        history.push('/');
      }

      setName(name);
      console.log('Get and Load Document');
      quill.setContents(document);
      quill.enable();
    });

    socket.emit('get-document', documentId, userInfo._id);

    return () => {};
  }, [socket, quill, documentId, userInfo, history]);

  // Send Changes
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  // Send Name Changes
  useEffect(() => {
    if (socket == null || name == null) return;

    socket.emit('send-changes-name', name);

    return () => {
      socket.off('send-changes-name', name);
    };
  }, [socket, name]);

  // Save Document
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents(), name);
    }, SAVE_INTERVAL_MS);

    // setTimeout(() => {
    //   setAlertStatus(true);
    // }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, name]);

  // Receive Changes
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  // Receive Name Changes
  useEffect(() => {
    if (socket == null || name == null) return;

    const handler = (nameReceived) => {
      if (nameReceived.length !== name.length) {
        setName(nameReceived);
      }
    };

    socket.on('receive-name-changes', handler);

    return () => {
      socket.off('receive-name-changes', handler);
    };
  }, [socket, name]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = '';

    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);
  return (
    <>
      {show && (
        <ModalPopUp show={show} handleClose={handleClose} id={documentId} />
      )}
      <div className="container mb-2">
        <Row className="mb-2">
          <Col xs={12}>
            <LinkContainer to={`/`}>
              <Button variant="primary">
                <i className="fas fa-arrow-left"></i> Back
              </Button>
            </LinkContainer>
            &nbsp;
            <Button variant="light" onClick={() => handleShow()}>
              <i className="fas fa-user-plus"></i> Editors
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Form.Control
              type="text"
              placeholder="Document Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-field"
            ></Form.Control>
          </Col>
        </Row>
      </div>
      <div
        className="container"
        ref={wrapperRef}
        style={{ color: '#000' }}
      ></div>
    </>
  );
};

export default TextEditor;
