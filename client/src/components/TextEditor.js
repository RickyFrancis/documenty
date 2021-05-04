import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ModalPopUp from '../components/ModalPopUp';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { DOCUMENT_DETAILS_RESET } from '../constants/documentConstants';
import { updateDocumentName } from '../actions/documentActions';

const SAVE_INTERVAL_MS = 2000;

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }], // dropdown with defaults from theme
  [{ color: [] }, { background: [] }, 'blockquote'], // dropdown with defaults from theme

  ['bold', 'italic', 'underline'], // toggled buttons

  ['strike', { script: 'sub' }, { script: 'super' }], // superscript/subscript align

  ['image', 'code-block', 'clean'],
];

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

  const documentUpdateName = useSelector((state) => state.documentUpdateName);
  const {
    loading: loadingUpdateName,
    error: errorUpdateName,
  } = documentUpdateName;

  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io();
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Get and load document
  useEffect(() => {
    if (socket == null || quill == null || userInfo == null) return;

    socket.once('load-document', (document, name, owner) => {
      if (document == null) {
        history.push('/');
      }

      setName(name);
      setOwner(owner);
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
  // useEffect(() => {
  //   if (socket == null || name == null) return;

  //   socket.emit('send-changes-name', name);

  //   return () => {
  //     socket.off('send-changes-name', name);
  //   };
  // }, [socket, name]);

  // Save Document
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

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
  // useEffect(() => {
  //   if (socket == null || name == null) return;

  //   const handler = (nameReceived) => {
  //     if (nameReceived.length !== name.length) {
  //       setName(nameReceived);
  //     }
  //   };

  //   socket.on('receive-name-changes', handler);

  //   return () => {
  //     socket.off('receive-name-changes', handler);
  //   };
  // }, [socket, name]);

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
    setName('Loading Document Name...');
    q.setText('Loading Document... Please wait a moment...');
    setQuill(q);
  }, []);

  const submitNameHandler = (e, name, documentId) => {
    e.preventDefault();
    dispatch(updateDocumentName(name, documentId));
  };

  const documentOwner =
    userInfo && owner && owner.toString() === userInfo._id.toString()
      ? true
      : false;

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
                <i className="fas fa-arrow-left"></i> &nbsp; Back
              </Button>
            </LinkContainer>
            &nbsp;
            {documentOwner && (
              <Button onClick={() => handleShow()} variant="light">
                <i className="fas fa-user-plus"></i> &nbsp; Editors
              </Button>
            )}
          </Col>
        </Row>
        {loadingUpdateName && <Loader />}
        {errorUpdateName && (
          <Message variant="danger">{errorUpdateName}</Message>
        )}
        <Form
          onSubmit={(e) => {
            submitNameHandler(e, name, documentId);
          }}
        >
          <Form.Row>
            <Col xs={documentOwner ? 10 : 12} md={documentOwner ? 11 : 12}>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Document Name"
                className="form-control flex-fill"
                disabled={!documentOwner}
              ></Form.Control>
            </Col>
            <Col xs={2} md={1} className={!documentOwner && 'd-none'}>
              <Button type="submit" variant="primary" style={{ width: '100%' }}>
                &nbsp;<i className="fas fa-check"></i>&nbsp;
              </Button>
            </Col>
          </Form.Row>
        </Form>
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
