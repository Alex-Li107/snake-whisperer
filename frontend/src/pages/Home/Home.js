import React, {useEffect, useState} from "react";
import "./Home.css"
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button"
import axios from "axios";

function Home() {
    let navigate = useNavigate();

    const [state, setState] = useState({
        username: "",
        validName: false,
        err: false,
        errMsg: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('home');
                const data = response.data;
                console.log(response)
                if (response.status === 200) {
                    setState((prevState) => ({
                        ...prevState,
                        username: data.username,
                        validName: true,
                        errMsg: "",
                        err: false
                    }));
                }
                else {
                    setState((prevState) => ({
                        ...prevState,
                        validName: false,
                        err: false
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [navigate]);

    const postTextToBackend = async (state) => {
        // check if name is empty or not
        if (state.username.trim() !== '') {
            setState((prevState) => ({
                ...prevState,
                validName: true,
                err: false
            }));
        }
        else {
            // return if empty and display error message
            setState((prevState) => ({
                ...prevState,
                validName: false,
                errMsg: "username must be filled!",
                err: true
            }));
            return;
        }
        try {
            const response = await axios.post('home', {"username": state.username});
            if(response.status === 200) {
                navigate('/chat');
            }
        } catch (error) {
            console.error('Error posting data:', error);
            setState((prevState) => ({
                ...prevState,
                validName: false,
                errMsg: "something went wrong!!!!",
                err: true
            }));
        }
    };

    const handleChange = (event) => {
        setState((prevState) => ({
            ...prevState,
            username: event.target.value
        }))
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        postTextToBackend(state);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            postTextToBackend(state);
        }
    };

    return (
        <div className={"home-bg"}>
            <div className={"login-box"}>
                <h1>Start Chatting</h1>
                <div className={"button-row"}>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className={"username-entry"}
                            value={state.username}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Username"
                        />
                    </form>
                    <Button
                        text={"Get Started"}
                        handleClick={handleSubmit}>
                        >
                    </Button>
                </div>
                {state.err ?
                    (
                        <p className={"err-msg"}>{state.errMsg}</p>
                    ) : (
                        <div></div>
                    )
                }
            </div>
        </div>
    )
}

export default Home