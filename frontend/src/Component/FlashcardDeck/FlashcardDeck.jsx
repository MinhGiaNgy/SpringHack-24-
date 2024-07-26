import React, { useState } from 'react';
import { CardTitle, CardText, Button } from 'reactstrap';
import './FlashcardDeck.css';

const FlashcardDeck = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    if (flashcards.length === 0) {
        return <div>No flashcards available. Please add some flashcards.</div>;
    }

    return (
        <div className="flashcard-container">
            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <CardTitle tag="h5">{flashcards[currentIndex].question}</CardTitle>
                    </div>
                    <div className="flip-card-back">
                        <CardText>{flashcards[currentIndex].answer}</CardText>
                    </div>
                </div>
            </div>
            <div className="navigation-arrows mt-3">
                <Button color="primary" onClick={handlePrev}>← Previous</Button>
                <Button color="primary" onClick={handleNext}>Next →</Button>
            </div>
        </div>
    );
};

export default FlashcardDeck;
