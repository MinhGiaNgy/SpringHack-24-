import React from 'react';
import './CSS/Login.css'; // Import your custom CSS for additional styling

export default function Login() {
  return (
    <div className='container-fluid vh-100 d-flex justify-content-center align-items-center' style={{ backgroundColor: '#f1f1f1' }}>
      <div className='login'>
        <div className='col-md-6 login-left'>
          <h2>Log in to</h2>
          <h2>LectureFlashMaster</h2>
          <h3>Not a member? <a className='login-signup' href='#'>Sign Up</a></h3>
        </div>
        <div className='col-md-6 login-right'>
          <h1>Log In</h1>
          <div className='login-info'>
            <input type='email' className='form-control mb-3' placeholder='Your Email' />
            <input type='text' className='form-control mb-3' placeholder='Username' />
            <input type='password' className='form-control mb-3' placeholder='Password' />
          </div>
          <button type='submit' className='btn btn-primary w-100'>Log In</button>
        </div>
      </div>
    </div>
  );
}
