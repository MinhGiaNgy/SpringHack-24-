import React, { useState, useRef } from 'react';
import axios from 'axios';
import FlashcardDeck from '../Component/FlashcardDeck/FlashcardDeck';
import { Button, Container, Input, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem } from 'reactstrap';
import './CSS/CreateDeck.css';

const CreateDeck = () => {
  const [deckName, setDeckName] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [modal, setModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleDeckNameChange = (event) => {
    setDeckName(event.target.value);
  };

  const handleSaveDeck = async () => {
    try {
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: deckName,
          flashcards: flashcards,  // Include flashcards data in the request body
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create deck');
      }

      console.log('Deck created successfully:', deckName);
    } catch (error) {
      console.error('Error creating deck:', error);
    }
  };


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        console.log('Uploading file:', file.name);
        
        const response = await fetch('/api/generation/make-flashcard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            num: 10,
            prompt: file.name,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate flashcards');
        }

        const data = await response.json();
        console.log('Generated flashcards:', data);
        setFlashcards(data.flashcards);

      } catch (error) {
        console.error('Error generating flashcards:', error);
      }
    }
  };

  


  const handleSavedTranscriptClick = async () => {
    try {
      const response = await axios.get('/api/transcripts');
      if (response.data.length === 0) {
        alert('No saved transcripts available.');
        return;
      }
      setTranscripts(response.data);
      setModal(true);
    } catch (error) {
      console.error('Error fetching transcripts:', error);
      alert('Failed to fetch transcripts.');
    }
  };

  const handleTranscriptSelect = async (transcript) => {
    setModal(false);

    try {
      const response = await axios.post('/api/generation/make-flashcard', {
        transcriptId: transcript.id,
        num: 10,
      });

      if (response.data.flashcards && response.data.flashcards.length > 0) {
        console.log('Generated flashcards:', response.data);
        setFlashcards(response.data.flashcards);

        // Optionally save the deck if desired here
        await handleSaveDeck();
      } else {
        alert('No flashcards generated from the selected transcript.');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    }
  };

  const toggleModal = () => setModal(!modal);

  return (
    <Container className="CreateDeck">
      <h1>Create Deck</h1>
      <div className="deck-section">
        <h3>Deck name:</h3>
        <div className="deck-name">
          <input type="text" className="form-control mb-2" placeholder="My Deck #1" value={deckName} onChange={handleDeckNameChange} />
          <Button color="primary" className="mr-2" onClick={handleSaveDeck}>Save Deck</Button>
        </div>
        <div className="upload-options">
          <Button color='primary' onClick={handleSavedTranscriptClick}>Saved Transcript</Button>
          <Input type="file" innerRef={fileInputRef} onChange={handleFileChange} className="input-file" />
        </div>
      </div>
      <div className="flashcard-section">
        {flashcards.length > 0 ? (
          <div>
            <h3>Generated Flashcards</h3>
            <FlashcardDeck flashcards={flashcards} />
          </div>
        ) : (
          <p>No flashcards generated yet. Please upload a file or record audio to create flashcards.</p>
        )}
      </div>

      {/* Modal for selecting transcripts */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Select a Transcript</ModalHeader>
        <ModalBody>
          {transcripts.length === 0 ? (
            <p>No transcripts available</p>
          ) : (
            <ListGroup>
              {transcripts.map(transcript => (
                <ListGroupItem key={transcript.id} onClick={() => handleTranscriptSelect(transcript)}>
                  {transcript.title}
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default CreateDeck;
