import React from 'react';
import './Features.css';

export default function Features() {
    return (
        <section className="features">
            <h2>Features</h2>
            <div className="feature-list">
                <div className="feature">
                    <h3>Real-time note taker</h3>
                    <p>Let us help you take note while sitting in the lecture hall!</p>
                </div>
                <div className="feature">
                    <h3>Generate flashcards</h3>
                    <p>AI-generated flashcards based on your notes</p>
                </div>
                <div className="feature">
                    <h3>Practice with friends</h3>
                    <p>Share your deck with classmates and ace your class</p>
                </div>
            </div>
            <div className="feature-container"></div> {/* Ensure space below feature boxes */}
        </section>
    );
};
