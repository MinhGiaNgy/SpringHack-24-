const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Card = require('../models/card.model');
const Flashcard = require('../models/flashcard.model');
const Multicard = require('../models/multicard.model');
const Deck = require('../models/deck.model');

router.post('/', async (req, res) => {
    try {
        const { deck, type, ...cardData } = req.body;
        cardData.user = req.user.id;
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
        res.status(200).json(savedCard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const cards = await Card.find({ user: req.user.id });
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        if (card.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
        res.status(200).json(card);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
        res.status(200).json(updatedCard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: 'Card not found' });
        if (card.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

        await Card.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id', async (req, res) => {
    try {
        const cards = await Card.find({ deck: req.params.id });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CardRequestDTO:
 *        type: object
 *        required:
 *          - deck
 *          - type
 *          - term
 *          - definition
 *        properties:
 *          deck:
 *            type: string
 *            description: The ID of the deck to which the card will be added.
 *            example: "60d5c51f6b1e8c001f1e4a29"
 *          type:
 *            type: string
 *            description: The type of the card (e.g., Flashcard, Multicard).
 *            example: "Flashcard"
 *          term:
 *            type: string
 *            description: The front content of the card.
 *            example: "What is the capital of France?"
 *          definition:
 *            type: string
 *            description: The back content of the card.
 *            example: "Paris"
 *     CardResponseDTO:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: The ID of the card.
 *            example: "60d5c51f6b1e8c001f1e4a29"
 *          deck:
 *            type: string
 *            description: The ID of the deck to which the card will be added.
 *            example: "60d5c51f6b1e8c001f1e4a29"
 *          type:
 *            type: string
 *            description: The type of the card (e.g., Flashcard, Multicard).
 *            example: "Flashcard"
 *          term:
 *            type: string
 *            description: The front content of the card.
 *            example: "What is the capital of France?"
 *          definition:
 *            type: string
 *            description: The back content of the card.
 *            example: "Paris"
 *          user:
 *            type: string
 *            description: The ID of the user that owns the card.
 *            example: "60d5c51f6b1e8c001f1e4a29"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 * 
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     description: Creates a new card of type Flashcard or Multicard and associates it with a deck. The card is also assigned to the authenticated user.
 *     tags:
 *       - Cards
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Card object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardRequestDTO'
 *     responses:
 *       200:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponseDTO'
 * 
 *   get:
 *     summary: Get all cards
 *     description: Retrieves a list of all cards.
 *     tags:
 *       - Cards
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CardResponseDTO'
 * 
 * /api/cards/{deckId}:
 *   post:
 *     summary: Get cards by deck ID
 *     description: Retrieves cards based on deck ID
 *     tags:
 *       - Cards
 *     parameters:
 *       - name: deckId
 *         in: path
 *         required: true
 *         description: The ID of the deck.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CardResponseDTO'
 * 
 * /api/cards/{cardId}:
 *   get:
 *     summary: Get a card by ID
 *     description: Retrieves a card based on its ID.
 *     tags:
 *       - Cards
 *     parameters:
 *       - name: cardId
 *         in: path
 *         required: true
 *         description: The ID of the card to retrieve.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Card retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponseDTO'
 *
 *   put:
 *     summary: Update a card by ID
 *     description: Updates the details of an existing card based on its ID.
 *     tags:
 *       - Cards
 *     parameters:
 *       - name: cardId
 *         in: path
 *         required: true
 *         description: The ID of the card to update.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Updated card object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardRequestDTO'
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponseDTO'
 * 
 *   delete:
 *     summary: Delete a card by ID
 *     description: Deletes a card based on its ID.
 *     tags:
 *       - Cards
 *     parameters:
 *       - name: cardId
 *         in: path
 *         required: true
 *         description: The ID of the card to delete.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Card deleted successfully
 */
