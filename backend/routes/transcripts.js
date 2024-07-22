const express = require('express');
const router = express.Router();
const Transcript = require('../models/transcript.model');

// @route   POST api/transcripts
// @desc    Create a new transcript
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, content, summary } = req.body;
    const newTranscript = new Transcript({
      title,
      content,
      summary,
      user: req.user.id
    });
    const savedTranscript = await newTranscript.save();
    res.status(201).json(savedTranscript);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   GET api/transcripts
// @desc    Get all transcripts
// @access  Private
router.get('/', async (req, res) => {
  try {
    const transcripts = await Transcript.find({ user: req.user.id });
    res.json(transcripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET api/transcripts/:id
// @desc    Get a single transcript by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);
    if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
    if (transcript.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT api/transcripts/:id
// @desc    Update a transcript by ID
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { title, content, summary } = req.body;
    const transcript = await Transcript.findById(req.params.id);
    if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
    if (transcript.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    transcript.title = title || transcript.title;
    transcript.content = content || transcript.content;
    transcript.summary = summary || transcript.summary;
    
    const updatedTranscript = await transcript.save();
    res.json(updatedTranscript);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @route   DELETE api/transcripts/:id
// @desc    Delete a transcript by ID
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);
    if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
    if (transcript.user.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await Transcript.deleteOne({ _id: req.params.id });
    res.json({ message: 'Transcript deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;