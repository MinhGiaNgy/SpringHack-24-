import mongoose from 'mongoose';
const mongoose = require('mongoose');

const MulticardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required.']
    },
    choiceNumber: {
        type: Number,
        required: [true, 'Number of choices is required.']
    },
    choices: {
        type: String,
        required: [true, 'Choices are required.']
    },
    createdAt: {
        type: Date,
        default: [Date.now, 'Creation Date is required.']
    },
});

const Multicard = mongoose.model('Multicard', MulticardSchema);
