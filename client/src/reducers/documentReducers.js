import {
  DOCUMENT_DELETE_FAIL,
  DOCUMENT_DELETE_REQUEST,
  DOCUMENT_DELETE_SUCCESS,
  DOCUMENT_DETAILS_FAIL,
  DOCUMENT_DETAILS_REQUEST,
  DOCUMENT_DETAILS_RESET,
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
  DOCUMENT_LIST_RESET,
  DOCUMENT_LIST_SUCCESS,
} from '../constants/documentConstants';

export const documentListReducer = (state = { documents: [] }, action) => {
  switch (action.type) {
    case DOCUMENT_LIST_REQUEST:
      return { loading: true, documents: [] };
    case DOCUMENT_LIST_SUCCESS:
      return {
        loading: false,
        documents: action.payload.documents,
        pages: action.payload.pages,
        page: action.payload.page,
        keyword: action.payload.keyword,
      };
    case DOCUMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    case DOCUMENT_LIST_RESET:
      return { loading: false, documents: [] };
    default:
      return state;
  }
};

export const documentDetailsReducer = (state = { document: {} }, action) => {
  switch (action.type) {
    case DOCUMENT_DETAILS_REQUEST:
      return { loading: true, document: {} };
    case DOCUMENT_DETAILS_SUCCESS:
      return {
        loading: false,
        document: action.payload,
      };
    case DOCUMENT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case DOCUMENT_DETAILS_RESET:
      return { loading: false, document: {} };
    default:
      return state;
  }
};

export const documentAddEditorReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCUMENT_EDITOR_ADD_REQUEST:
      return { loading: true };
    case DOCUMENT_EDITOR_ADD_SUCCESS:
      return { loading: false, success: true };
    case DOCUMENT_EDITOR_ADD_FAIL:
      return { loading: false, error: action.payload };
    case DOCUMENT_EDITOR_ADD_RESET:
      return {};
    default:
      return state;
  }
};

export const documentRemoveEditorReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCUMENT_EDITOR_REMOVE_REQUEST:
      return { loading: true };
    case DOCUMENT_EDITOR_REMOVE_SUCCESS:
      return { loading: false, success: true };
    case DOCUMENT_EDITOR_REMOVE_FAIL:
      return { loading: false, error: action.payload };
    case DOCUMENT_EDITOR_REMOVE_RESET:
      return {};
    default:
      return state;
  }
};

export const documentDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DOCUMENT_DELETE_REQUEST:
      return { loading: true };
    case DOCUMENT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case DOCUMENT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
