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
        // Fetch cards directly from the database
        const cards = await Card.find({ deck: deck._id }).sort({ _id: -1 });
        deck.cards = cards; // Assuming you want the full card objects
      } catch (error) {
        console.error(`Failed to fetch cards for deck ${deck._id}:`, error.message);
        deck.cards = []; // Fallback to empty array if the query fails
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

    // Fetch child cards for the deck directly from the database
    try {
      const cards = await Card.find({ deck: deck._id });
      deck.cards = cards; // Assuming you want the full card objects
    } catch (error) {
      console.error(`Failed to fetch cards for deck ${deck._id}:`, error.message);
      deck.cards = []; // Fallback to empty array if the query fails
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