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
        ref: 'User'
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }]
}, {
    timestamps: true
});

deckSchema.pre('remove', async function (next) {
    try {
        // Delete all cards associated with this deck
        await Card.deleteMany({ _id: { $in: this.cards } });
        next();
    } catch (error) {
        next(error);
    }
});

const Deck = model('Deck', deckSchema);
module.exports = Deck;