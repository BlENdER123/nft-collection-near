import { combineReducers } from 'redux';

import marketReducer from './market';
import appReducer from "./app";

export default combineReducers({
  marketReducer,
  appReducer

});
