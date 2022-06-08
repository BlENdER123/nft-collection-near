import "./index.scss";

// import { StyledEngineProvider } from "@mui/material/styles";
// import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import "./index.scss";
import "bootstrap";
import App from "./App";
// import Alert from "./components/toDelete/Alert";
import {reduxStore} from "./lib/redux";
// import { AlertMessageProps } from "./types";

ReactDOM.render(
	<Provider store={reduxStore}>
		{/*<StyledEngineProvider injectFirst>*/}
		{/*<SnackbarProvider*/}
		{/*  maxSnack={3}*/}
		{/*  autoHideDuration={10000}*/}
		{/*  anchorOrigin={{*/}
		{/*    horizontal: "right",*/}
		{/*    vertical: "bottom",*/}
		{/*  }}*/}
		{/*  content={(key, { message, type }: AlertMessageProps) => (*/}
		{/*    <Alert id={key} message={message} type={type} />*/}
		{/*  )}*/}
		{/*>*/}
		{/*  <React.StrictMode>*/}
		<App />
		{/*</React.StrictMode>*/}
		{/*</SnackbarProvider>*/}
		{/*</StyledEngineProvider>*/}
	</Provider>,
	document.getElementById("root"),
);
