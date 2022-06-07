import React, {useState} from "react";

function DropDown(props) {

    const [dropDownHide, setDropDownHide] = useState(false);

    return (
        <>
        <div style={{"cursor": "pointer"}} className="title" onClick={() => {setDropDownHide(!dropDownHide);}}>
            {props.title}{" "}
            {props.hint?
            <div
                aria-label={props.hint}
                className="hint hint--top hint--large"
            ></div>: null
            }
            {" "}
            <span
                className={dropDownHide ? "hidden" : ""}
                
            ></span>
        </div>
        <div className="text">{props.subtitle}</div>
        {dropDownHide? null:props.children}
        </>
    )


}

export default DropDown;