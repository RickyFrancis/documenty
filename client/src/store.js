import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
// import {
//   productListReducer,
//   productDetailsReducer,
//   productDeleteReducer,
//   productCreateReducer,
//   productUpdateReducer,
//   productReviewCreateReducer,
// } from './reducers/productReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
} from './reducers/userReducers';
import {
  documentDeleteReducer,
  documentListReducer,
  documentDetailsReducer,
  documentUpdateNameReducer,
  documentAddEditorReducer,
  documentRemoveEditorReducer,
} from './reducers/documentReducers';

const reducer = combineReducers({
  documentList: documentListReducer,
  documentDelete: documentDeleteReducer,
  documentDetails: documentDetailsReducer,
  documentUpdateName: documentUpdateNameReducer,
  documentAddEditor: documentAddEditorReducer,
  documentRemoveEditor: documentRemoveEditorReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
