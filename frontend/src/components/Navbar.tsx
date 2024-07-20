import React from 'react';
import './index.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <a href="#home">Home</a>
                <a href="#note-taker">Note-Taker</a>
                <a href="#flashcard">Flashcard</a>
                <a href="#files">Files</a>
            </div>
            <button className="login-button">Login</button>
        </nav>
    );
};

export default Navbar;
