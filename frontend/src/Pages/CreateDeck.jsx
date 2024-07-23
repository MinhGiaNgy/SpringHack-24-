import React, { useState, useRef } from 'react';
import FlashcardDeck from '../Component/FlashcardDeck/FlashcardDeck';
import { Button, Container, Input, FormGroup, Form, Label } from 'reactstrap';
import './CSS/CreateDeck.css';

const CreateDeck = () => {
  const [deckName, setDeckName] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create deck');
      }

      console.log('Deck created successfully:', deckName);
      // Optionally, reset form fields or handle UI state
    } catch (error) {
      console.error('Error creating deck:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleUploadFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Simulating file upload to backend
        console.log('Uploading file:', file.name);
        
        // Assuming you send the file to the backend and receive response to generate flashcards
        const response = await fetch('/api/generation/make-flashcard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            num: 10, // Example number of flashcards to generate
            prompt: file.name, // Example prompt based on file name
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate flashcards');
        }

        const data = await response.json();
        console.log('Generated flashcards:', data);

        // Set generated flashcards in state
        setFlashcards(data.flashcards);

      } catch (error) {
        console.error('Error generating flashcards:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  const handleRecordAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioChunks([...audioChunks, event.data]);
    }
  };

  return (
    <Container className="CreateDeck">
      <h1>Create Deck</h1>
      <div className="deck-section">
        <h3>Deck name:</h3>
        <div className="deck-name">
          <input type="text" className="form-control mb-2" placeholder="My Deck #1" value={deckName} onChange={handleDeckNameChange} />
          <Button color="primary" className="mr-2" onClick={handleSaveDeck}>Save</Button>
        </div>
        <div className="upload-options">
          {isRecording ? (
            <Button color="danger" className="mr-2" onClick={handleStopRecording}>Stop Recording</Button>
          ) : (
            <Button color="primary" className="mr-2" onClick={handleRecordAudio}>Record audio</Button>
          )}
          <Button color="primary" onClick={handleUploadFile}>Upload file</Button>
          <Input type="file" innerRef={fileInputRef} onChange={handleFileChange} className="input-file" />
        </div>
      </div>
      <div className="flashcard-section">
        <FlashcardDeck flashcards={flashcards} />
      </div>
    </Container>
  );
};

export default CreateDeck;
