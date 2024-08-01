import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Transcript.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { AudioRecorder } from 'react-audio-voice-recorder';

export default function Transcript() {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', summary: '' });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const submitAudio = async (audioBlob) => {
    setAudioLoading(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/api/generation/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({ title: '', content: response.data.response.text, summary: '' });
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error uploading audio:', error.response ? error.response.data : error.message);    
    }
    handleCloseModal();
    setAudioLoading(false);
    audioBlob = null;
    
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setIsEditing(false);
    setSelectedTranscript(null);
  };

  const handleShowEditModal = (transcript) => {
    setSelectedTranscript(transcript);
    setFormData({ title: transcript.title, content: transcript.content, summary: transcript.summary || '' });
    setShowEditModal(true);
  };

  const handleShowCreateModal = () => {
    setFormData({ title: '', content: '', summary: '' });
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFormData({ title: '', content: '' });
  };

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("File content:", event.target.result); // Debugging
        setFormData({ ...formData, content: event.target.result });
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a .txt file.');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/transcripts/${selectedTranscript._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response.data);
      setSelectedTranscript(response.data);
      setIsEditing(false);
      setShowEditModal(false);

      const updatedTranscripts = transcripts.map((transcript) =>
        transcript._id === response.data._id ? response.data : transcript
      );
      setTranscripts(updatedTranscripts);
    } catch (error) {
      console.error('Error updating transcript:', error);
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/transcripts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response.data);
      setTranscripts([...transcripts, response.data]);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating transcript:', error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/transcripts/${selectedTranscript._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTranscripts(transcripts.filter((transcript) => transcript._id !== selectedTranscript._id));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error deleting transcript:', error);
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirmed = () => {
    handleDelete();
    setShowDeleteConfirmation(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);  // Revert to the view mode
    // Reset form data to original values
    setFormData({
      title: selectedTranscript.title,
      content: selectedTranscript.content,
      summary: selectedTranscript.summary || ''
    });
  };

  const hasChanges = 
    formData.title !== selectedTranscript?.title || 
    formData.content !== selectedTranscript?.content ||
    (formData.summary !== (selectedTranscript?.summary || ''));

    const handleSummarize = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found.');
        return;
      }
  
      setIsSummarizing(true);
  
      try {
        const response = await axios.post(
          'http://localhost:5000/api/generation/summarize',
          { prompt: selectedTranscript.content },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        const summary = response.data.response;
  
        await axios.put(
          `http://localhost:5000/api/transcripts/${selectedTranscript._id}`,
          { ...selectedTranscript, summary },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        const updatedTranscripts = transcripts.map((transcript) =>
          transcript._id === selectedTranscript._id ? { ...transcript, summary } : transcript
        );
        setTranscripts(updatedTranscripts);
        setSelectedTranscript({ ...selectedTranscript, summary });
      } catch (error) {
        console.error('Error summarizing transcript:', error);
      } finally {
        setIsSummarizing(false);
      }
    };

  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('JWT not found. Please log in.');
        }
        const response = await axios.get('http://localhost:5000/api/transcripts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTranscripts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscripts();
  }, []);

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='px-md-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-4'>
            <h3 className='fw-bold'>Your Transcripts</h3>
            <div id='btn-group' className='d-flex'>
              <button 
                id='upload-btn' 
                type='button' 
                className='btn btn-primary'
                onClick={handleShowCreateModal}
              >
                Create
              </button>
              <button 
                id='record-btn' 
                type='button' 
                className='btn btn-primary mx-1 fw-bold'
                onClick={handleShowModal}
              >
                Record
              </button>
            </div>
          </div>
          <div id='transcript-list' className='container'>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && transcripts.length === 0 && <div>No transcripts available.</div>}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {!loading && !error && transcripts.length > 0 && transcripts.map((transcript) => (
                <div className="col d-flex" key={transcript._id} >
                  <div 
                    key={transcript._id} 
                    className="transcript-item card mb-3 p-3 d-flex flex-column" 
                    onClick={() => handleShowEditModal(transcript)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <h4 style={{ textAlign: 'left' }}>{transcript.title}</h4>
                    <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{transcript.content}</p>
                    {transcript.summary && (
                      <div>
                        <p style={{ textAlign: 'left'}}><strong>Summary:</strong></p>
                        <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}> {transcript.summary}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>
                  {isEditing ? 'Edit Transcript' : selectedTranscript?.title}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {isEditing ? (
                  <Form onSubmit={handleSubmitEdit}>
                    <Form.Group controlId="formTitle">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formContent">
                      <Form.Label>Content</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formSummary">
                      <Form.Label>Summary</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button variant="secondary" onClick={handleCancelEdit} className="me-2 mt-2">
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit" disabled={!hasChanges} className="mt-2">
                        Save
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <h4>Content</h4>
                    <p>{selectedTranscript?.content}</p>
                    {selectedTranscript?.summary && (
                      <>
                        <h4>Summary</h4>
                        <p>{selectedTranscript.summary}</p>
                      </>
                    )}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                {!isEditing && (
                  <>
                    <Button variant="secondary" onClick={handleCloseEditModal} className="me-2">
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleEdit} className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete} className="me-2">
                      Delete
                    </Button>
                    {!selectedTranscript?.summary && (
                      <Button variant="success" onClick={handleSummarize} disabled={isSummarizing} className="me-2">
                        {isSummarizing ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          'Summarize'
                        )}
                      </Button>
                    )}
                  </>
                )}
              </Modal.Footer>
            </Modal>
            <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this transcript?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCancelDelete}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteConfirmed}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>Create Transcript</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmitCreate}>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formSummary">
                    <Form.Label>Summary</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formFile" className="mt-3">
                    <Form.Label>Upload .txt file</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".txt"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <div className='d-flex justify-content-end'>
                  <Button variant="secondary" onClick={handleCloseCreateModal} className="me-2 mt-2">
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="mt-2">
                    Save
                  </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
                
            {/* Upload audio Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Record</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="d-flex justify-content-center">
                  <AudioRecorder 
                    onRecordingComplete={(blob) => submitAudio(blob)}
                    audioTrackConstraints={{
                      noiseSuppression: true,
                      echoCancellation: true,
                    }}
                    showVisualizer={true}
                  />
                </div>
                {audioLoading && <div className="d-flex justify-content-center"><Spinner animation="border" /></div>}
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}