import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './CSS/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', { email, password });

      if (response.status === 200) {
        console.log('Login successful:', response.data);

        localStorage.setItem('token', response.data.token);
        setEmail('');
        setPassword('');
        setError(null); // Clear any previous errors

        // Redirect to home page after successful login
        navigate('/');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className='container-fluid p-0' style={{ backgroundColor: '#f1f1f1' }}>
      <div className='login-container'>
        <div className='col-md-6 login-left'>
          <h2>Log in to</h2>
          <h2>LectureFlashMaster</h2>
          <h3>Not a member? <a className='login-signup' href='/signup'>Sign Up</a></h3>
        </div>
        <div className='col-md-6 login-right'>
          <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
            <div className='login-info'>
              <input
                type='email'
                className='form-control mb-3'
                placeholder='Your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type='password'
                className='form-control mb-3'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <button type='submit' className='btn btn-primary w-100'>Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
