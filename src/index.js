import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import rootReducer from "./store/reducers";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import { SnackbarProvider } from 'notistack';
import Alert from './components/Alert/Alert';
import './index.scss';
import App from './App';

export const store = createStore(
    rootReducer,
    composeWithDevTools()
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={10000}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                content={(key, { message, type }) => (
                    <Alert id={key} message={message} type={type} />
                )}

            >
                {/* <React.StrictMode> */}
                <App/>
                {/* </React.StrictMode> */}
            </SnackbarProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
