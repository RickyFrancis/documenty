import axios from 'axios';
import {
  DOCUMENT_DELETE_FAIL,
  DOCUMENT_DELETE_REQUEST,
  DOCUMENT_DELETE_SUCCESS,
  DOCUMENT_DETAILS_FAIL,
  DOCUMENT_DETAILS_REQUEST,
  DOCUMENT_DETAILS_SUCCESS,
  DOCUMENT_EDITOR_ADD_FAIL,
  DOCUMENT_EDITOR_ADD_REQUEST,
  DOCUMENT_EDITOR_ADD_RESET,
  DOCUMENT_EDITOR_ADD_SUCCESS,
  DOCUMENT_EDITOR_REMOVE_FAIL,
  DOCUMENT_EDITOR_REMOVE_REQUEST,
  DOCUMENT_EDITOR_REMOVE_RESET,
  DOCUMENT_EDITOR_REMOVE_SUCCESS,
  DOCUMENT_LIST_FAIL,
  DOCUMENT_LIST_REQUEST,
  DOCUMENT_LIST_SUCCESS,
  DOCUMENT_NAME_UPDATE_FAIL,
  DOCUMENT_NAME_UPDATE_REQUEST,
  DOCUMENT_NAME_UPDATE_RESET,
  DOCUMENT_NAME_UPDATE_SUCCESS,
} from '../constants/documentConstants';

export const listDocuments = (keyword = '', pageNumber = '1') => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: DOCUMENT_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `/api/documents?keyword=${keyword}&pageNumber=${pageNumber}`,
      config
    );

    dispatch({
      type: DOCUMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOCUMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteDocument = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCUMENT_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/documents/${id}`, config);

    dispatch({
      type: DOCUMENT_DELETE_SUCCESS,
    });
    dispatch({
      type: DOCUMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOCUMENT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getSingleDocument = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCUMENT_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/documents/${id}`, config);

    dispatch({
      type: DOCUMENT_DETAILS_SUCCESS,
      payload: data,
    });
    dispatch({
      type: DOCUMENT_EDITOR_ADD_RESET,
    });
    dispatch({
      type: DOCUMENT_EDITOR_REMOVE_RESET,
    });
    dispatch({
      type: DOCUMENT_NAME_UPDATE_RESET,
    });
  } catch (error) {
    dispatch({
      type: DOCUMENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateDocumentName = (name, documentId) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: DOCUMENT_NAME_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/documents/${documentId}/name`,
      { name },
      config
    );
    dispatch({
      type: DOCUMENT_DETAILS_SUCCESS,
      payload: data,
    });

    dispatch({
      type: DOCUMENT_NAME_UPDATE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: DOCUMENT_NAME_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addEditor = (email, documentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOCUMENT_EDITOR_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/documents/${documentId}/editors`,
      { email },
      config
    );
    dispatch({
      type: DOCUMENT_DETAILS_SUCCESS,
      payload: data,
    });

    dispatch({
      type: DOCUMENT_EDITOR_ADD_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: DOCUMENT_EDITOR_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const removeEditor = (email, documentId) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: DOCUMENT_EDITOR_REMOVE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    console.log(typeof email);
    console.log(email);

    const { data } = await axios.put(
      `/api/documents/${documentId}/editors`,
      { email },
      config
    );

    dispatch({
      type: DOCUMENT_DETAILS_SUCCESS,
      payload: data,
    });
    dispatch({
      type: DOCUMENT_EDITOR_REMOVE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: DOCUMENT_EDITOR_REMOVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
