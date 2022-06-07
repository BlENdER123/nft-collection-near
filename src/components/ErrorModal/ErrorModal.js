import React from "react";
import {useDispatch, useSelector} from "react-redux";

function ErrorModal() {
	
    const dispatch = useDispatch();

    const modalState = useSelector(state => state.reducerError.errorModal);

    const closeError = () => {
        dispatch({type: "closeError", payload: ""});
    }

	return (
		<>
      ErrorModal
        <div
            className={
                modalState.hidden === false
                    ? "error-bg"
                    : "hide"
            }
        >
            
        </div>

        <div
            className={modalState.hidden === false ? "error-modal" : "hide"}
        >
            <button className="close" onClick={closeError}>
                <span></span>
                <span></span>
            </button>
            <div className="message">{modalState.message}</div>
            <button className="button-3-square" onClick={closeError}>
                OK
            </button>
        </div>

        </>
	);
}

export default ErrorModal;
