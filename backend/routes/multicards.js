const express = require('express');
const router = express.Router();
const Multicard = require('../models/multicard.model'); 
const authMiddleware = require('../middleware/auth'); 


router.post('/', authMiddleware, async (req, res) => {
    try {
      const { question, choiceNumber, choices } = req.body;
      const newMulticard = new Multicard({
        question,
        choiceNumber,
        choices,
        user: req.user.id 
      });
      const savedMulticard = await newMulticard.save();
      res.status(201).json(savedMulticard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


router.get('/', authMiddleware, async (req, res) => {
    try {
      const multicards = await Multicard.find({ user: req.user.id });
      res.json(multicards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

 
router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const multicard = await Multicard.findById(req.params.id);
      if (!multicard) return res.status(404).json({ error: 'Multicard not found' });
      if (multicard.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
      res.json(multicard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { question, choiceNumber, choices } = req.body;
      const multicard = await Multicard.findById(req.params.id);
      if (!multicard) return res.status(404).json({ error: 'Multicard not found' });
      if (multicard.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
  
      multicard.question = question || multicard.question;
      multicard.choiceNumber = choiceNumber || multicard.choiceNumber;
      multicard.choices = choices || multicard.choices;
      
      const updatedMulticard = await multicard.save();
      res.json(updatedMulticard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const multicard = await Multicard.findById(req.params.id);
      if (!multicard) return res.status(404).json({ error: 'Multicard not found' });
      if (multicard.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
  
      await Multicard.deleteOne({ _id: req.params.id });
      res.json({ message: 'Multicard deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
