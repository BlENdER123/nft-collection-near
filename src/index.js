import React from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";

import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {SnackbarProvider} from "notistack";
import {StyledEngineProvider} from "@mui/material/styles";

//import Alert from "./components/Alert/Alert";
import "./index.scss";
import "bootstrap";
import App from "./App";

const defaultState = {
	connectWallet: false,
};

import {Buffer} from "buffer";
global.Buffer = Buffer;

const reducer = (state = defaultState, action) => {
	switch (action.type) {
		case "openConnect":
			return {...state, connectWallet: true};
		case "closeConnect":
			return {...state, connectWallet: false};
		default:
			return state;
	}
};

export const store = createStore(reducer);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<StyledEngineProvider injectFirst>
				<SnackbarProvider
					maxSnack={3}
					autoHideDuration={10000}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					content={(key, {message, type}) => (
						<Alert id={key} message={message} type={type} />
					)}
				>
					{/* <React.StrictMode> */}
					<App />
					{/* </React.StrictMode> */}
				</SnackbarProvider>
			</StyledEngineProvider>
		</BrowserRouter>
	</Provider>,
	document.getElementById("root"),
);
