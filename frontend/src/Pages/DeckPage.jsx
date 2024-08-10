import React, { useState, useEffect } from 'react';
import FileUpload from '../Component/FileUpload/FileUpload';
import FlashcardDeck from '../Component/FlashcardDeck/FlashcardDeck';
import AddEditFlashcard from '../Component/AddEditFlashcard/AddEditFlashcard';
import { Card, CardBody, CardTitle } from 'reactstrap';
import './CSS/DeckPage.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const DeckPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState(null);

  const fetchCards = async (deckId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/decks/${deckId}`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleSaveFlashcard = async (flashcard) => {
    try {
      const response = await axios.post('http://localhost:5000/api/cards', flashcard);
      setFlashcards([...flashcards, response.data]);
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cards/${cardId}`);
      setFlashcards(flashcards.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

const handleUploadFlashcards = (newFlashcards) => {
    setFlashcards([...flashcards, ...newFlashcards]);
  };

  useEffect(() => {
    const deckId = 'your-deck-id';
    fetchCards(deckId);
  }, []);

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
