import React, { useState, useRef } from 'react';
import FlashcardDeck from '../Component/FlashcardDeck/FlashcardDeck';
import { Button, Container, Row, Col, Input } from 'reactstrap';
import './CSS/CreateDeck.css'; // Import your CSS file

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

  const handleSaveDeck = () => {
    // Handle saving deck to database or local storage
    console.log('Saving deck:', deckName, flashcards);
  };

  const handleUploadFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here, e.g., upload to server, process, etc.
      console.log('Uploaded file:', file);
      // You can also set the file state if needed
      // setUploadedFile(file);
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
