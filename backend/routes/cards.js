const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Card = require('../models/card.model');
const Flashcard = require('../models/flashcard.model');
const Multicard = require('../models/multicard.model');
const Deck = require('../models/deck.model');

// Create a new card (either Flashcard or Multicard)
router.post('/', async (req, res) => {
    try {
        const { deck, type, ...cardData } = req.body;
        cardData.user = req.user.id; // Assign the card to the authenticated user
        let card;
        if (type === 'Flashcard') {
            card = new Flashcard({
                deck: deck,
                type: type,
                ...cardData
        });
        } else if (type === 'Multicard') {
            card = new Multicard({
                deck: deck,
                type: type,
                ...cardData
        });
        } else {
            return res.status(400).json({ message: 'Invalid card type' });
        }
        const savedCard = await card.save();

        // Update the deck to include the new card
        if (deck) {
            const updatedDeck = await Deck.findByIdAndUpdate(
                deck,
                { $push: { cards: savedCard._id } },
                { new: true, runValidators: true }
            );
            if (!updatedDeck) {
                return res.status(404).json({ message: 'Deck not found' });
            }
        }
        res.status(201).json(savedCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all cards for the authenticated user
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find({ });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific card by ID
router.get('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        if (card.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a card by ID
router.put('/:id', async (req, res) => {
    try {
        const { term, definition, question, choiceNumber, choices } = req.body;
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        if (card.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        if (card.type === 'Flashcard') {
            card.term = term || card.term;
            card.definition = definition || card.definition;
        } else if (card.type === 'Multicard') {
            card.question = question || card.question;
            card.choiceNumber = choiceNumber || card.choiceNumber;
            card.choices = choices || card.choices;
        }

        const updatedCard = await card.save();
        res.json(updatedCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a card by ID
router.delete('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        if (card.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        await card.remove();
        res.json({ message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;