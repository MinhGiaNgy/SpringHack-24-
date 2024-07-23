import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import { Container, Row, Col, Form, FormGroup, Input, Button } from 'reactstrap';
import './CSS/Signup.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Assuming default role is USER
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        username: email, // Assuming username is the same as email for simplicity
        password,
        role,
        firstName,
        lastName,
      });

      console.log('Signup successful:', response.data);

      // Reset the form fields after successful signup
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Signup error:', error.message);
      setError('Signup failed. Please check your details and try again.');
    }
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
    </div>
  );
};

export default Signup;
