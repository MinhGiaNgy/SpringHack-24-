import mongoose from "mongoose";
const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    createdAt: {
        type: Date,
        default: [Date.now, 'Creation Date is required.']
    },
    createdBy: {
        type:String,
        required: [true, 'Creator is required.']
    },
});

const Deck = mongoose.model('Deck', deckSchema);