const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Deck = require('./deck.model');

const cardSchema = new Schema({
    deck: {
        type: Schema.Types.ObjectId,
        ref: 'Deck',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        
    },
    type: {
        type: String,
        required: true,
        enum: ['Flashcard', 'Multicard']
    }
}, {
    timestamps: true,
    discriminatorKey: 'type'
});

// Middleware to update the associated deck when a card is deleted
cardSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
    try {
        // Remove this card's ID from the associated deck's cards array
        await Deck.findByIdAndUpdate(
        doc.deck,
        { $pull: { cards: doc._id } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const Card = model('Card', cardSchema);
module.exports = Card;
