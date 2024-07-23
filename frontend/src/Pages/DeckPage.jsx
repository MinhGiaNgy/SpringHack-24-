import React, { useState } from 'react';
import FileUpload from '../Component/FileUpload/FileUpload';
import FlashcardDeck from '../Component/FlashcardDeck/FlashcardDeck';
import AddEditFlashcard from '../Component/AddEditFlashcard/AddEditFlashcard';
import { Card, CardBody, CardTitle } from 'reactstrap';
import './CSS/DeckPage.css';
import { Link } from 'react-router-dom';


const DeckPage = () => {
  const [flashcards, setFlashcards] = useState([]);

  const handleSaveFlashcard = (flashcard) => {
    setFlashcards([...flashcards, flashcard]);
  };

  const handleUploadFlashcards = (newFlashcards) => {
    setFlashcards([...flashcards, ...newFlashcards]);
  };

  return (
    <div className="deck-page">
      <h1 className="my-4 text-center">Flashcard Deck</h1>
      <div className='deck-page-container'>
        <div className='deck-page-left' md="8">
          <FlashcardDeck flashcards={flashcards} />
        </div>
        <div className='deck-page-right' md="4">
          <Card className="options-card mb-4">
            <CardBody>
              <FileUpload onUpload={handleUploadFlashcards} />
            </CardBody>
          </Card>
          <Card className="options-card-add">
            <CardBody>
              <CardTitle tag="h5">Add Flashcard</CardTitle>
              <AddEditFlashcard onSave={handleSaveFlashcard} />
            </CardBody>
          </Card>
        </div>
      </div>
      <Link to='/createdeck' className="add-button">
        <i className="bi bi-plus-lg plus-icon"></i>
      </Link>
    </div>
  );
};

export default DeckPage;
