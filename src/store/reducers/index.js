import { combineReducers } from 'redux';

import marketReducer from './market';
import appReducer from "./app";
import editorReducer from "./editor";

export default combineReducers({
  marketReducer,
  appReducer,
  editorReducer

});
