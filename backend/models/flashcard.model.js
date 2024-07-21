const mongoose = require('mongoose');
const Card = require('./card.model');

const flashcardSchema = new mongoose.Schema({
    term: {
        type: String,
        required: [true, 'Term is required.']
    },
    definition: {
        type: String,
        required: [true, 'Definition is required.']
    }
}, {
    timestamps: true
});

const Flashcard = Card.discriminator('Flashcard', flashcardSchema);
module.exports = Flashcard;