import mongoose from 'mongoose';
const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    term: {
        type: String,
        required: [true, 'Term is required.']
    },
    definition: {
        type: String,
        required: [true, 'Definition is required.']
    },
    createdAt: {
        type: Date,
        default: [Date.now, 'Creation Date is required.']
    },
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
