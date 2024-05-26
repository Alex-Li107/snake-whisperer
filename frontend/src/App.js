import { Routes, Route } from 'react-router-dom';
import React from 'react'
import './App.css';

// pages
import Home from "./pages/Home/Home.js"
import Chat from "./pages/Chat/Chat.js"

/**
 * A function used to return the App
 *
 * @returns {JSX.Element} The App
 * @constructor
 */
function App() {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/chat' element={<Chat />}/>
                <Route path='/chat/:id' element={<Chat />}/>
            </Routes>
        </div>
    );
}

export default App;
