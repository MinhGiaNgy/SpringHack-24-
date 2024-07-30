const express = require('express');
const router = express.Router();
const Flashcard = require('../models/flashcard.model');
const authMiddleware = require('../middleware/auth'); 


router.post('/', authMiddleware, async (req, res) => {
    try {
      const { term, definition } = req.body;
      const newFlashcard = new Flashcard({
        term,
        definition,
        user: req.user.id 
      });
      const savedFlashcard = await newFlashcard.save();
      res.status(201).json(savedFlashcard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

router.get('/', authMiddleware, async (req, res) => {
    try {
      const flashcards = await Flashcard.find({ user: req.user.id });
      res.json(flashcards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const flashcard = await Flashcard.findById(req.params.id);
      if (!flashcard) return res.status(404).json({ error: 'Flashcard not found' });
      if (flashcard.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
      res.json(flashcard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { term, definition } = req.body;
      const flashcard = await Flashcard.findById(req.params.id);
      if (!flashcard) return res.status(404).json({ error: 'Flashcard not found' });
      if (flashcard.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
  
      flashcard.term = term || flashcard.term;
      flashcard.definition = definition || flashcard.definition;
      
      const updatedFlashcard = await flashcard.save();
      res.json(updatedFlashcard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const flashcard = await Flashcard.findById(req.params.id);
      if (!flashcard) return res.status(404).json({ error: 'Flashcard not found' });
      if (flashcard.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
  
      await Flashcard.deleteOne({ _id: req.params.id });
      res.json({ message: 'Flashcard deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;

  