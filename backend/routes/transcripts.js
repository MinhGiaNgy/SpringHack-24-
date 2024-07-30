const express = require('express');
const router = express.Router();
const Transcript = require('../models/transcript.model');

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
    res.status(200).json(savedTranscript);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const transcripts = await Transcript.find({ user: req.user.id });
    res.json(transcripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

/**
 * @swagger
 * components:
 *   schemas:
 *     TranscriptRequestDTO:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the transcript.
 *           example: "Lecture on AI"
 *         content:
 *           type: string
 *           description: The full content of the transcript.
 *           example: "In this lecture, we discuss artificial intelligence..."
 *         summary:
 *           type: string
 *           description: A brief summary of the transcript.
 *           example: "An overview of artificial intelligence trends."
 *     TranscriptResponseDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the transcript.
 *           example: "60d5c51f6b1e8c001f1e4a30"
 *         title:
 *           type: string
 *           description: The title of the transcript.
 *           example: "Lecture on AI"
 *         content:
 *           type: string
 *           description: The full content of the transcript.
 *           example: "In this lecture, we discuss artificial intelligence..."
 *         summary:
 *           type: string
 *           description: A brief summary of the transcript.
 *           example: "An overview of artificial intelligence trends."
 *         user:
 *           type: string
 *           description: The ID of the user who created the transcript.
 *           example: "60d5c51f6b1e8c001f1e4a30"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 * 
 * /api/transcripts:
 *   post:
 *     summary: Create a new transcript
 *     description: Creates a new transcript for the authenticated user.
 *     tags:
 *       - Transcripts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Transcript object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TranscriptRequestDTO'
 *     responses:
 *       200:
 *         description: Transcript created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TranscriptResponseDTO'
 * 
 *   get:
 *     summary: Get all transcripts
 *     description: Retrieves a list of all transcripts for the authenticated user.
 *     tags:
 *       - Transcripts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transcripts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TranscriptResponseDTO'
 * 
 * /api/transcripts/{id}:
 *   get:
 *     summary: Get a transcript by ID
 *     description: Retrieves a transcript by its ID for the authenticated user.
 *     tags:
 *       - Transcripts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the transcript to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transcript retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TranscriptResponseDTO'
 * 
 *   put:
 *     summary: Update a transcript by ID
 *     description: Updates the details of an existing transcript by its ID.
 *     tags:
 *       - Transcripts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the transcript to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated transcript object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TranscriptRequestDTO'
 *     responses:
 *       200:
 *         description: Transcript updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TranscriptResponseDTO'
 * 
 *   delete:
 *     summary: Delete a transcript by ID
 *     description: Deletes a transcript by its ID for the authenticated user.
 *     tags:
 *       - Transcripts
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the transcript to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transcript deleted successfully
 */
