import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Transcript.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Transcript() {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setIsEditing(false);
    setSelectedTranscript(null);
  };

  const handleShowEditModal = (transcript) => {
    setSelectedTranscript(transcript);
    setFormData({ title: transcript.title, content: transcript.content });
    setShowEditModal(true);
  };

  const handleShowCreateModal = () => {
    setFormData({ title: '', content: '' });
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
      content: selectedTranscript.content
    });
  };

  const hasChanges = 
  formData.title !== selectedTranscript?.title || 
  formData.content !== selectedTranscript?.content;

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
        {/* <nav className='col-md-3 col-lg-2 d-md-block bg-light sidebar'>
          <div className='position-sticky pt-3'>
            <ul className='nav flex-column'>
              <li className='nav-item'>
                <a className='nav-link text-dark text-decoration-none d-flex align-items-center' href='#'>
                  <svg width="22.5px" height="22.5px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#0F0F0F"/>
                  </svg>
                  <span className='ms-2'>Saved</span>
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link text-dark text-decoration-none d-flex align-items-center' href='#'>
                  <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className='ms-2'>Trash</span>
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link text-dark text-decoration-none d-flex align-items-center' href='#'>
                  <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className='ms-2'>Download</span>
                </a>
              </li>
            </ul>
          </div>
        </nav> */}
        {/* <div className='col-md-9 ms-sm-auto col-lg-10 px-md-4'> */}
        <div className='px-md-4'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2'>
            <h3 className='fw-bold'>Saved Transcripts</h3>
            <button 
              id='upload-btn' 
              type='button' 
              className='btn btn-primary'
              onClick={handleShowCreateModal}
            >
              Create
            </button>
          </div>
          <div id='transcript-list' className='container'>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && transcripts.length === 0 && <div>No transcripts available.</div>}
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'>
              {!loading && !error && transcripts.length > 0 && transcripts.map((transcript) => (
                <div 
                  key={transcript._id} 
                  className="transcript-item card mb-3 p-3" 
                  onClick={() => handleShowEditModal(transcript)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{transcript.title}</h3>
                  <p>{transcript.content}</p>
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
            <Button 
              variant="secondary"
              onClick={handleCancelEdit}
              className="mt-3 me-2"
            >
              Cancel
            </Button>
            <Button 
              variant={hasChanges ? "primary" : "secondary"} 
              type="submit" 
              className="mt-3"
              disabled={!hasChanges}
            >
              Submit
            </Button>
          </Form>
        ) : (
          <>
            <p>{selectedTranscript?.content}</p>
            <Button variant="warning" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="danger" className="ms-2" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEditModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

            {/* Create Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>Create New Transcript</Modal.Title>
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
                  <Form.Group controlId="formFile">
                    <Form.Label>Upload .txt File</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".txt"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Submit
                  </Button>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseCreateModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
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
          </div>
        </div>
      </div>
    </div>  
  );
}