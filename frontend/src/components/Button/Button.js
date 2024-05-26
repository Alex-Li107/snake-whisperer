import React from "react";
import "./Button.css"

function Button({text, handleClick}) {
    return (
        <button
            onClick={handleClick}
            className={"button"}
        >{text}
        </button>
    )
}

export default Button