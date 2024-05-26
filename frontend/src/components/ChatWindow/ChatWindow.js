import React, {useEffect, useState} from "react";
import "./ChatWindow.css"

function ChatWindow({messages, newMessage, messageID}) {
    const chatMessages = [];
    if(!newMessage) {
        const result = messages.find(message => message.id === messageID);
        const { user, assistant } = JSON.parse(result.messages);
        for (let i = 0; i < user.length; i++) {
            let assistantMsgCleaned = assistant[i].replace(/<\|endoftext\|>$/, '');
            chatMessages.push(
                <div>
                    <p className={"user-msgs"}>
                        User: {user[i]}
                    </p>
                    <p className={"mamba-msgs"}>
                        Mamba: {assistantMsgCleaned}
                    </p>
                </div>
            );
        }
    }

    return (
        <div className={"chat-window-container"}>
            {newMessage ? (
                <h2>Create New Message</h2>
            ) : (
                <div>
                    {chatMessages}
                </div>
            )}
        </div>
    )
}

export default ChatWindow