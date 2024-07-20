import React, { useState } from 'react';
import axios from 'axios';
import { Form, FormGroup, Button } from 'reactstrap';
import './FileUpload.css';

const FileUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('YOUR_BACKEND_API_ENDPOINT', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpload(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <Form>
            <FormGroup className="file-upload-container">
                <input type="file" id="file" onChange={handleFileChange} className="file-input" />
                <div type="file" className="file-upload-box" onClick={() => document.getElementById('file').click()}>
                    Click to upload a file
                </div>
            </FormGroup>
            <Button className='upload-button' onClick={handleUpload} disabled={!file}>Upload</Button>
        </Form>
    );
};

export default FileUpload;
