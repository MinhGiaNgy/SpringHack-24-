const express = require('express');
const router = express.Router();
const Deck = require('../models/deck.model'); 
const Card = require('../models/card.model');
const authMiddleware = require('../middleware/auth'); 

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        message: 'Name is required',
      });
    }
    const newDeck = new Deck({
      name,
      user: req.user.id 
    });
    const savedDeck = await newDeck.save();
    res.status(201).json(savedDeck);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user.id });

    const updatedDecks = await Promise.all(decks.map(async (deck) => {
      try {
        const cards = await Card.find({ deck: deck._id }).sort({ _id: -1 });
        deck.cards = cards;
      } catch (error) {
        console.error(`Failed to fetch cards for deck ${deck._id}:`, error.message);
        deck.cards = [];
      }
      return deck;
    }));

    res.status(200).json({
      count: updatedDecks.length,
      data: updatedDecks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deck = await Deck.findById(id);

    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    try {
      const cards = await Card.find({ deck: deck._id });
      deck.cards = cards;
    } catch (error) {
      console.error(`Failed to fetch cards for deck ${deck._id}:`, error.message);
      deck.cards = [];
    }

    res.status(200).json(deck);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        message: 'Name is required',
      });
    }
    const { id } = req.params;
    const deck = await Deck.findById(id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    deck.name = name;
    const updatedDeck = await deck.save();
    res.status(200).json(updatedDeck);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deck = await Deck.findById(id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });
    if (deck.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await Card.deleteMany({ deck: id })
    await Deck.deleteOne({ _id: id });
    res.status(200).send({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     DeckRequestDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the deck.
 *           example: "History Deck"
 * 
 *     DeckResponseDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the deck.
 *           example: "History Deck"
 *         user:
 *           type: string
 *           description: The ID of the user who owns the deck.
 *           example: "60d5c51f6b1e8c001f1e4a30"
 *         cards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CardResponseDTO'
 *           description: List of cards associated with the deck.
 *         _id:
 *           type: string
 *           description: The ID of the deck.
 *           example: "60d5c51f6b1e8c001f1e4a30"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 * 
 * /api/decks:
 *   post:
 *     summary: Create a new deck
 *     description: Creates a new deck for the authenticated user.
 *     tags:
 *       - Decks
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Deck object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeckRequestDTO'
 *     responses:
 *       201:
 *         description: Deck created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeckResponseDTO'
 * 
 *   get:
 *     summary: Get all decks
 *     description: Retrieves a list of all decks for the authenticated user, including associated cards.
 *     tags:
 *       - Decks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of decks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Number of decks
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeckResponseDTO'
 * 
 * /api/decks/{id}:
 *   get:
 *     summary: Get a deck by ID
 *     description: Retrieves a deck and its associated cards by ID for the authenticated user.
 *     tags:
 *       - Decks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the deck to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deck retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeckResponseDTO'
 * 
 *   put:
 *     summary: Update a deck by ID
 *     description: Updates the details of an existing deck by its ID.
 *     tags:
 *       - Decks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the deck to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated deck object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeckRequestDTO'
 *     responses:
 *       200:
 *         description: Deck updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeckResponseDTO'
 * 
 *   delete:
 *     summary: Delete a deck by ID
 *     description: Deletes a deck and all associated cards by its ID.
 *     tags:
 *       - Decks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the deck to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deck deleted successfully
 */
