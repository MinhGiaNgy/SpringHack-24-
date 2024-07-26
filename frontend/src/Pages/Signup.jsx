import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { Container, Row, Col, Form, FormGroup, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './CSS/Signup.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        username,
        password,
        role: "USER",
        firstName,
        lastName,
      });

      console.log('Signup successful:', response.data);

      setFirstName('');
      setLastName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setError(null);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Signup error:', error.message);
      setError('Signup failed. Please check your details and try again.');
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login'); // Redirect to login page after closing modal
  };
  return (
    <div className="signup-page">
      <Container>
        <Row className="justify-content-center align-items-center vh-100">
          <Col md="6" className="signup-left text-center">
            <h1>Create new Account</h1>
            <h3>Already have an account? <a className="signup-login" href="/login">Log In</a></h3>
          </Col>
          <Col md="6">
            <div className="signup-form">
              <h1 className="text-center mb-4">Sign Up</h1>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormGroup>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <Button type="submit" color="primary" block>Sign Up</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={showSuccessModal} toggle={handleModalClose}>
        <ModalHeader toggle={handleModalClose}>Signup Successful</ModalHeader>
        <ModalBody>
          Your account has been created successfully! You will be redirected to the login page.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleModalClose}>OK</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Signup;
