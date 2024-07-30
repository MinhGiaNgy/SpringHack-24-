import React, { useState } from 'react';
import FileUpload from '../Component/FileUpload/FileUpload';
import FlashcardDeck from '../Component/FlashcardDeck/FlashcardDeck';
import AddEditFlashcard from '../Component/AddEditFlashcard/AddEditFlashcard';
import { Card, CardBody, CardTitle } from 'reactstrap';
import './CSS/DeckPage.css';
import { Link, useParams, useHistory } from 'react-router-dom'; 
import axios from 'axios';


const DeckPage = () => {
  const { deckId } = useParams(); 
  const history = useHistory();
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState(''); 

  useEffect(() => {
    axios.post(`/api/cards/${deckId}`) 
      .then(response => {
        setFlashcards(response.data);
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
      });
  }, [deckId]);

  const handleSaveFlashcard = (flashcard) => {
    axios.post('/api/cards', { deckId, content: flashcard }) 
    .then(response => {
    setFlashcards([...flashcards, response.data]);
    })
    .catch(error => {
      console.error('Error adding card:', error);
    }); 
  };

const handleDeleteCard = (cardId) => {
    axios.delete(`/api/cards/${cardId}`) 
      .then(() => {
        setFlashcards(flashcards.filter(card => card.id !== cardId));
      })
      .catch(error => {
        console.error('Error deleting card:', error);
      });
  };

const handleDeckClick = (deckId) => {
    history.push(`/cards/${deckId}`); 
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
              <input 
                type="text" 
                value={newCard} 
                onChange={e => setNewCard(e.target.value)} 
                placeholder="New card content" 
              />
             <button onClick={handleSaveFlashcard}>Add Card</button> 
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
