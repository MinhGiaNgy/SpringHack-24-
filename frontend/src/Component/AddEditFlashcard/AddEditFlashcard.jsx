import React, { useState } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import './AddEditFlashcard.css';

export default function AddEditFlashcard({ onSave }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ question, answer });
        setQuestion('');
        setAnswer('');
    };

    return (
        <Form onSubmit={handleSubmit} className="add-edit-flashcard-form">
            <FormGroup>
                <Input
                    type="text"
                    id="question"
                    placeholder="Enter the question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    className="input-field"
                />
            </FormGroup>
            <FormGroup>
                <Input
                    type="text"
                    id="answer"
                    placeholder="Enter the answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                    className="input-field"
                />
            </FormGroup>
            <Button color="primary" type="submit" className="save-button">Save</Button>
        </Form>
    );
}
