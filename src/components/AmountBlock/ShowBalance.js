import React from "react";
import {useSelector} from "react-redux";

function ShowBalance(props) {

    return (
        <>
            {props.showBal &&
            <div className={props.classWrapper}>
                {props.balance}
            </div>
            }
        </>
    )
}

export default ShowBalance;