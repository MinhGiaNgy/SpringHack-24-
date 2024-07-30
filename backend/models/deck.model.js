const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Card = require('./card.model');

const deckSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User ID is required.'],
        ref: 'User'
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }]
}, {
    timestamps: true
});

const Deck = model('Deck', deckSchema);
module.exports = Deck;