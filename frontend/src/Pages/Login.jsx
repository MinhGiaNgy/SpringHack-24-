import React, { useState } from 'react';
import './CSS/Login.css'; // Import your custom CSS for additional styling

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic here, e.g., API call or validation
    console.log({
      email,
      password
    });
    // Reset the form fields after submission
    setEmail('');
    setPassword('');
  };

  return (
    <div className='container-fluid vh-100 d-flex justify-content-center align-items-center' style={{ backgroundColor: '#f1f1f1' }}>
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
            <button type='submit' className='btn btn-primary w-100'>Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
