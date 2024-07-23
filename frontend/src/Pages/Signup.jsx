import React from 'react';
import './CSS/Signup.css'; 

export default function Signup() {

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('user'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      password,
      role
    });
  };

  return (
    <div className='container-fluid vh-100 d-flex justify-content-center align-items-center' style={{ backgroundColor: '#f1f1f1' }}>
      <div className='signup-container'>
        <div className='col-md-6 signup-left'>
          <h2>Create new</h2>
          <h2>Account</h2>
          <h3>Already have an account? <a className='signup-login' href='login'>Log In</a></h3>
        </div>
        <div className='col-md-6 signup-right'>
          <form onSubmit={handleSubmit}>f
            <div className='signup-info'>
              <input type='text' className='form-control mb-3' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <input type='text' className='form-control mb-3' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <input type='email' className='form-control mb-3' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type='password' className='form-control mb-3' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type='hidden' name='role' value={role} />
            </div>
            <button type='submit' className='btn btn-primary w-100'>Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}
