const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Deck = require('./deck.model');

const cardSchema = new Schema({
    deck: {
        type: Schema.Types.ObjectId,
        required: [true, 'Deck ID is required.'],
        ref: 'Deck',
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User is required.'],
        ref: 'User',
    },
    type: {
        type: String,
        required: [true, 'Card type is required.'],
        enum: ['Flashcard', 'Multicard']
    }
}, {
    timestamps: true,
    discriminatorKey: 'type'
});

cardSchema.post('deleteOne', { document: true, query: false }, async function (doc, next) {
    try {
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
