import React from "react";

function DoubleField(props) {

    return (
        <>
        <div className={"setting"}>
            <div className="inputs">
                <div className="title-settings">{props.firstField[0]}</div>
                <div className="title-settings">{props.secondField[0]}</div>
            </div>
            <div className="inputs">
                <div className="info">
                    {props.firstField[1]}
                </div>
                <div className="info">
                    {props.secondField[1]}
                </div>
            </div>
        </div>
        </>
    )


}

export default DoubleField;