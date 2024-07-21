const express = require('express');
const router = express.Router();
const Deck = require('../models/deck.model'); 
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
    res.status(200).json({
      count: decks.length,
      data: decks,
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

    await deck.remove();
    res.status(200).send({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
