import React, {useEffect, useState} from "react";
import axios from 'axios';
import "./Chat.css"
import { useNavigate } from "react-router-dom";

import PastMessageWidget from "../../components/PastMessageWidget/PastMessageWidget";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

function Chat() {
    let navigate = useNavigate();

    const [state, setState] = useState({
        messages: [],
        newMessage: '',
        isNewMessage: true,
        curUrl: "",
        messageID: 0,
        username: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            let data, isNewMessage = true, id = 0;
            const currentUrl = window.location.href;
            // Extract the number from the end of the URL using regular expressions
            const match = currentUrl.match(/\/(\d+)$/);
            let response
            try {
                if (match) {
                    isNewMessage = false;
                    id = parseInt(match[1]);
                    const url = '/chat/' + id +'/'
                    response = await axios.get(url);
                }
                else {
                    response = await axios.get('/chat/');
                }
                console.log(response)
                data = response.data;
                setState((prevState) => ({
                    ...prevState,
                    messages: data.messages,
                    username: data.username,
                    isNewMessage: isNewMessage,
                    curUrl: currentUrl,
                    messageID: id
                }));
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [navigate]);

    const handleChange = (event) => {
        setState((prevState) => ({
            ...prevState,
            newMessage: event.target.value
        }))
    };

    const postTextToBackend = async (state) => {
        const data = {
            message: state.newMessage
        }
        setState((prevState) => ({
            ...prevState,
            newMessage: ''
        }))
        let response;
        try {
            if(state.messageID === 0) {
                response = await axios.post('/chat/',data);
                navigate("/chat/" + response.data.serializer_data.id);
            }
            else {
                const url = '/chat/' + state.messageID +'/'
                await axios.put(url,data);
                response = await axios.get(url);
                setState((prevState) => ({
                    ...prevState,
                    messages: response.data.messages,
                }));
            }
        } catch (error) {
            console.error(error);
        }
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

    const handleCreateNewMessage = () => {
        navigate('/chat/')
    }

    return (
        <div className={"chat-container"}>
            <div className={"chat-history-container"}>
                <div
                    className={"create-new-message"}
                    onClick={handleCreateNewMessage}
                >
                    <p className={"title"}>Create New Message</p>
                </div>
                {state.messages.map(message => (
                    <PastMessageWidget title={message.title} id={message.id}>
                    </PastMessageWidget>
                ))}
            </div>
            <div className={"main-chat-container"}>
                <div className={"chat-window"}>
                    <ChatWindow
                        messages={state.messages}
                        newMessage={state.isNewMessage}
                        messageID={state.messageID}
                        username={state.username}
                    ></ChatWindow>
                </div>
                <div className={"input-area"}>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className={"message-entry"}
                            value={state.newMessage}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Your message here..."
                            rows="4"
                            cols="50"
                        />
                    </form>
                    <button className={"button"} onClick={handleSubmit}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat