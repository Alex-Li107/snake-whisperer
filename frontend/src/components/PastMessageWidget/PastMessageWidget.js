import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./PastMessageWidget.css"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from "axios";


function PastMessageWidget({title, id}) {
    let navigate = useNavigate();

    function handleClick() {
        const newPath = "/chat/" + id
        navigate(newPath);
    }

    const handleDelete = async () => {
        console.log("here")
         const response = await axios.delete('/chat/' + id + '/');
         navigate('/chat/');
    }

    return (
        <div
            className={"past-message-widget-wrapper"}
            onClick={handleClick}
        >
            <p className={"title"}>{title}</p>
            <div onClick={handleDelete}>
                <DeleteOutlineIcon
                    className={"delete-button"}>
                </DeleteOutlineIcon>
            </div>
        </div>
    )
}

export default PastMessageWidget