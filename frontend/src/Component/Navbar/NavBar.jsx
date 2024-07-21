import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <a href="#home">Home</a>
                <a href="#note-taker">Note-Taker</a>
                <a href="#flashcard">Flashcard</a>
                <a href="#files">Files</a>
            </div>
            <Link to="/login">
                <button className="login-button">Login</button>
            </Link>
        </nav>
    );
};
