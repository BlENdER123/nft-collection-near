import {combineReducers} from "redux";

import marketReducer from "./market";
import appReducer from "./app";
import editorReducer from "./editor";
import errorModalReducer from "./errorModal";

export default combineReducers({
	marketReducer,
	appReducer,
	editorReducer,
	errorModalReducer,
});
