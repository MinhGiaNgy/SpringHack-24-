import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/Transcript.css'; 

export default function Transcript() {
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <nav className='col-md-3 col-lg-2 d-md-block bg-light sidebar'>
          <div className='position-sticky pt-3'>
            <ul className='nav flex-column'>
              <li className='nav-item'>
              <a className='nav-link text-dark text-decoration-none d-flex align-items-center' href='#'>
                  <svg width="22.5px" height="22.5px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#0F0F0F"/>
                  </svg>
                  <span className='ms-2'>Saved</span>
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link text-dark text-decoration-none d-flex align-items-center' href='#'>
                  <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span className='ms-2'>Trash</span>
                </a>
              </li>
              <li className='nav-item'>
              <a className='nav-link text-dark text-decoration-none d-flex align-items-center' href='#'>
                  <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span className='ms-2'>Download</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2'>
            <h3 className='fw-bold'>Saved Transcripts</h3>
            <button id='upload-btn' type='button' className='btn'>Upload</button>
          </div>
          <div id='transcript-list' className='d-flex flex-column justify-content-between'>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && transcripts.length === 0 && <div>No transcripts available.</div>}
            {!loading && !error && transcripts.length > 0 && transcripts.map((transcript) => (
              <div key={transcript._id} className="transcript-item card mb-3 p-3">
                <h2>{transcript.title}</h2>
                <p>{transcript.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>  
  )
}