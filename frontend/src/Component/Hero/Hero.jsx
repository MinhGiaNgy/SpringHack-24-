import React from 'react';
import './Hero.css';

export default function Hero() {
    return (
        <section id="hero" className="hero">
            <div className="container">
                <h1>LectureFlashMaster</h1>
                <h2>Real-Time Lecture Summarization and Study Aid</h2>
                <p>Save time, stay productive and study better!</p>
                <button className="btn-primary">Try Now!</button>
            </div>
        </section>
    );
};
