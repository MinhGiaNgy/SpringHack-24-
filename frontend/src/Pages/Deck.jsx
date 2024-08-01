import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Deck.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Decks() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', cards: [{ term: '', definition: '' }] });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setIsEditing(false);
    setSelectedDeck(null);
  };

  const handleShowEditModal = (deck) => {
    setSelectedDeck(deck);
    setFormData({ name: deck.name, cards: deck.cards.map(card => ({ term: card.term, definition: card.definition })) });
    setShowEditModal(true);
  };

  const handleShowCreateModal = () => {
    setFormData({ name: '', cards: [{ term: '', definition: '' }] });
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFormData({ name: '', cards: [{ term: '', definition: '' }] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCardChange = (index, field, value) => {
    const newCards = formData.cards.map((card, i) => i === index ? { ...card, [field]: value } : card);
    setFormData({ ...formData, cards: newCards });
  };

  const handleAddCard = () => {
    setFormData({ ...formData, cards: [...formData.cards, { term: '', definition: '' }] });
  };

  const handleRemoveCard = (index) => {
    setFormData({ ...formData, cards: formData.cards.filter((_, i) => i !== index) });
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
        `http://localhost:5000/api/decks/${selectedDeck._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response.data);
      setSelectedDeck(response.data);
      setIsEditing(false);
      setShowEditModal(false);

      const updatedDecks = decks.map((deck) =>
        deck._id === response.data._id ? response.data : deck
      );
      setDecks(updatedDecks);
    } catch (error) {
      console.error('Error updating deck:', error);
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
      // Step 1: Create the deck
      const deckResponse = await axios.post(
        'http://localhost:5000/api/decks',
        formData, // Assuming formData.title contains the deck name
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const deckId = deckResponse.data._id;

      // Step 2: Create each card associated with the deck
      const createCardPromises = formData.cards.forEach((card) => {
        console.log(card);
        console.log(deckId);
        axios.post(
          'http://localhost:5000/api/cards',
          { ...card, deck: deckId, type: "Flashcard" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      });

      // Wait for all card creation requests to complete
      Promise.all(createCardPromises)
      .then((responses) => {
        console.log('All cards created successfully:', responses);
        // Handle successful creation of all cards
      })
      .catch((error) => {
        console.error('Error creating some cards:', error);
        // Handle errors for card creation
      });

      // Optionally, you can fetch the newly created deck with its cards to update the state
      const updatedDeckResponse = await axios.get(
        `http://localhost:5000/api/decks/${deckId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Add the newly created deck with its cards to the state
      setDecks([...decks, updatedDeckResponse.data]);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating deck and cards:', error);
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
        `http://localhost:5000/api/decks/${selectedDeck._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDecks(decks.filter((deck) => deck._id !== selectedDeck._id));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error deleting deck:', error);
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
      name: selectedDeck.name,
      cards: selectedDeck.cards.map(card => ({ term: card.term, definition: card.definition }))
    });
  };

  const hasChanges = 
    formData.name !== selectedDeck?.name || 
    formData.cards.length !== selectedDeck?.cards.length ||
    formData.cards.some((card, index) => 
      card.term !== selectedDeck.cards[index].term || 
      card.definition !== selectedDeck.cards[index].definition
    );

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('JWT not found. Please log in.');
        }
        const response = await axios.get('http://localhost:5000/api/decks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDecks(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='px-md-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-4'>
            <h3 className='fw-bold'>Your Decks</h3>
            <button 
              id='upload-btn' 
              type='button' 
              className='btn btn-primary'
              onClick={handleShowCreateModal}
            >
              Create
            </button>
          </div>
          <div id='deck-list' className='container'>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && decks.length === 0 && <div>No decks available.</div>}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {!loading && !error && decks.length > 0 && decks.map((deck) => (
                <div className="col d-flex" key={deck._id}>
                    <div 
                      className="deck-item card mb-3 p-3 d-flex flex-column" 
                      onClick={() => handleShowEditModal(deck)}
                      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <h4 style={{ textAlign: 'left' }}>{deck.name}</h4>
                    </div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>
                  {isEditing ? 'Edit Deck' : selectedDeck?.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {isEditing ? (
                  <Form onSubmit={handleSubmitEdit}>
                    <Form.Group controlId="formName">
                      <Form.Label>Deck Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {formData.cards.map((card, index) => (
                      <div key={index} className="mt-3">
                        <Form.Group controlId={`formTerm-${index}`}>
                          <Form.Label>Term</Form.Label>
                          <Form.Control
                            type="text"
                            value={card.term}
                            onChange={(e) => handleCardChange(index, 'term', e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group controlId={`formDefinition-${index}`} className="mt-2">
                          <Form.Label>Definition</Form.Label>
                          <Form.Control
                            type="text"
                            value={card.definition}
                            onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
                          />
                        </Form.Group>
                        <Button variant="danger" onClick={() => handleRemoveCard(index)} className="mt-2">
                          Delete Card
                        </Button>
                      </div>
                    ))}
                    <div className="d-flex align-items-end">
                    <Button variant="secondary" onClick={handleAddCard} className="mt-3 me-2">
                      Add Card
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit} className="me-2 mt-3">
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={!hasChanges} className="mt-3">
                      Save
                    </Button>
                    </div>
                  </Form>
                ) : (
                  <div>
                    {selectedDeck?.cards.map((card, index) => (
                      <div key={index} className="mb-3">
                        <h5>{card.term}</h5>
                        <p>{card.definition}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!isEditing && selectedDeck && selectedDeck.cards.length === 0 && <div className="d-flex justify-content-center">Empty deck</div>}
              </Modal.Body>
              <Modal.Footer>
                {!isEditing && (
                  <>
                    <Button variant="secondary" onClick={handleCloseEditModal} className="me-2">
                      Close
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete} className="me-2">
                      Delete
                    </Button>
                    <Button variant="primary" onClick={handleConfirmDelete} className="me-2">
                      View
                    </Button>
                  </>
                )}
              </Modal.Footer>
            </Modal>
            <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this deck?
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
                <Modal.Title>Create Deck</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmitCreate}>
                  <Form.Group controlId="formName">
                    <Form.Label>Deck Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {formData.cards.map((card, index) => (
                    <div key={index} className="mt-3">
                      <Form.Group controlId={`formTerm-${index}`}>
                        <Form.Label>Term</Form.Label>
                        <Form.Control
                          type="text"
                          value={card.term}
                          onChange={(e) => handleCardChange(index, 'term', e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId={`formDefinition-${index}`} className="mt-2">
                        <Form.Label>Definition</Form.Label>
                        <Form.Control
                          type="text"
                          value={card.definition}
                          onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="danger" onClick={() => handleRemoveCard(index)} className="mt-2">
                        Delete Card
                      </Button>
                    </div>
                  ))}
                  <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                    <Button variant="secondary" onClick={handleAddCard} className="mt-3 me-2">
                        Add Card
                    </Button>
                    <Button variant="secondary" onClick={handleCloseCreateModal} className="me-2 mt-3">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="mt-3">
                        Save
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
      <Link to='/createdeck' className="add-button">
        <i className="bi bi-plus-lg plus-icon"></i>
      </Link>
    </div>
  );
}