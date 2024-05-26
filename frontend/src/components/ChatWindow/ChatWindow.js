import React, {useEffect, useState} from "react";
import "./ChatWindow.css"

function ChatWindow({messages, newMessage, messageID, username}) {
    const chatMessages = [];
    if(!newMessage) {
        const result = messages.find(message => message.id === messageID);
        const { user, assistant } = JSON.parse(result.messages);
        for (let i = 0; i < user.length; i++) {
            // get rid of the eot token
            let assistantMsgCleaned = assistant[i].replace(/<\|endoftext\|>$/, '');
            chatMessages.push(
                <div>
                    <p className={"user-msgs"}>
                        {username}: {user[i]}
                    </p>
                    <div className={"mamba-msg-container"}>
                        <p className={"mamba-msgs"}>
                            Mamba:
                        </p>
                        <p className={"mamba-msgs"}>
                            {assistantMsgCleaned}
                        </p>
                    </div>

                </div>
            );
        }
    }

    return (
        <div className={"chat-window-container"}>
            {newMessage ? (
                <div>
                    <h2>Welcome {username}!</h2>
                    <h2>Create New Message</h2>
                </div>

            ) : (
                <div>
                    {chatMessages}
                </div>
            )}
        </div>
    )
}

export default ChatWindow