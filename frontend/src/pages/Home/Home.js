import React from "react";
import "./Home.css"
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button"

function Home() {
    let navigate = useNavigate();

    function handleClick() {
        navigate("/chat");
    }

    return (
        <div className={"home-bg"}>
            <div className={"login-box"}>
                <h1>Start Chatting</h1>
                <div className={"button-row"}>
                    <Button
                        text={"Get Started"}
                        handleClick={handleClick}>
                    >
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Home