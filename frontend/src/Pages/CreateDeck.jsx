import React, { useState, useRef } from 'react';
import axios from 'axios';
import FlashcardDeck from '../Component/FlashcardDeck/FlashcardDeck';
import { Button, Container, Input, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, Alert } from 'reactstrap';
import './CSS/CreateDeck.css';

const CreateDeck = () => {
  const [deckName, setDeckName] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [modal, setModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const getAuthToken = () => localStorage.getItem('token');

  const handleDeckNameChange = (event) => {
    setDeckName(event.target.value);
  };

  const handleSaveDeck = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post('http://localhost:5000/api/decks', {
        name: deckName,
        flashcards: flashcards,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status !== 201) {
        throw new Error('Failed to create deck');
      }

      setSuccessMessage('Deck created successfully!');
      setDeckName('');
      setFlashcards([]);
      setTranscripts([]);
      setModal(false);
      fileInputRef.current.value = '';  // Clear file input

    } catch (error) {
      console.error('Error creating deck:', error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token found');

        const reader = new FileReader();
        reader.onload = async (e) => {
          const transcriptContent = e.target.result;

          const response = await axios.post('http://localhost:5000/api/generation/make-flashcard', {
            num: 5,
            prompt: transcriptContent,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status !== 201) {
            throw new Error('Failed to generate flashcards');
          }

          const data = response.data;
          console.log('Generated flashcards:', data);
          setFlashcards(data.flashcards);
        };

        reader.readAsText(file);  // Read the file content as text

      } catch (error) {
        console.error('Error generating flashcards:', error);
      }
    }
  };

  const handleSavedTranscriptClick = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get('http://localhost:5000/api/transcripts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.length === 0) {
        alert('No saved transcripts available.');
        return;
      }
      setTranscripts(response.data);
      setModal(true);
    } catch (error) {
      console.error('Error fetching transcripts:', error);
      alert(`Failed to fetch transcripts: ${error.message}`);
    }
  };

  const handleTranscriptSelect = async (transcript) => {
    setModal(false);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(`http://localhost:5000/api/transcripts/${transcript.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const transcriptData = response.data;

      const flashcardResponse = await axios.post('http://localhost:5000/api/generation/make-flashcard', {
        transcriptId: transcript.id,
        transcript: transcriptData,
        num: 10,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (flashcardResponse.data.flashcards && flashcardResponse.data.flashcards.length > 0) {
        console.log('Generated flashcards:', flashcardResponse.data);
        setFlashcards(flashcardResponse.data.flashcards);

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
          <Input type="text" className="form-control mb-2" placeholder="My Deck #1" value={deckName} onChange={handleDeckNameChange} />
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

      {successMessage && (
        <Alert color="success">
          {successMessage}
        </Alert>
      )}
    </Container>
  );
};

export default CreateDeck;
