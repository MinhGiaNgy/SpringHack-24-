const mongoose = require('mongoose');
const Card = require('./card.model');

const multicardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required.']
    },
    choiceNumber: {
        type: Number,
        required: [true, 'Number of choices is required.']
    },
    choices: [{
        type: String,
        required: [true, 'Choices are required.']
    }],
}, {
    timestamps: true
});

const Multicard = Card.discriminator('Multicard', multicardSchema);
module.exports = Multicard;