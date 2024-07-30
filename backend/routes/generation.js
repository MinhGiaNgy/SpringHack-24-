const express = require('express');
const axios = require('axios');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');

require('dotenv').config();

router.post('/summarize', async (req, res) => {
    const template = "You are a teacher. The user will give you a transcript of a lesson and you have to summarize it for them. In your summary, you can use bullet points to make the ideas clear, understandable but still accurate. Do not use markdown symbols such as headers or bold, italic, underline, etc. in your response.";
    const prompt = req.body.prompt;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                        "type": "text",
                        "text": template
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                        "type": "text",
                        "text": prompt
                        }
                    ]
                }
            ],
            max_tokens: 2048,
            temperature: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API: ', error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

router.post('/make-flashcard', async (req, res) => {
    const { num, prompt } = req.body;
    const template = `You are a teacher. The user will give you a transcript of a lesson and you have to create ${num} flashcards about concepts or questions relating to the lesson, meaning that the user can answer the flashcards only based on the lesson's transcript. Your response should be in json containing an array of flashcards in dictionary type and delimited by three backticks as such: \n\`\`\`json\n[\n\t{\n\t\t"term": "string",\n\t\t"definition": "string"\n\t}\n]\n\`\`\``;
    
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                        "type": "text",
                        "text": template
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                        "type": "text",
                        "text": prompt
                        }
                    ]
                }
            ],
            max_tokens: 2048,
            temperature: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        const content = response.data.choices[0].message.content;
        const json = content.match(/```json([\s\S]*?)```/);
        if (json && json[1]) {
            const flashcards = JSON.parse(json[1].trim());
            res.json(flashcards);
        } else {
            res.status(500).json({ error: 'Failed to parse OpenAI API response' });
        }
    } catch (error) {
        console.error('Error calling OpenAI API: ', error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('file');

router.post('/transcribe', upload, async (req, res) => {
    try {
        const audioPath = req.file.path;

        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioPath));
        formData.append('model', 'whisper-1');

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                ...formData.getHeaders(),
            }
        });

        fs.unlinkSync(audioPath);

        res.json({ response: response.data });
    } catch (error) {
        console.error('Error calling OpenAI API: ', error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     SummarizeRequest:
 *       type: object
 *       properties:
 *         prompt:
 *           type: string
 *           description: The transcript content to summarize.
 *           example: "This is a detailed transcript of the lesson..."
 *     SummarizeResponse:
 *       type: object
 *       properties:
 *         response:
 *           type: string
 *           description: The summarized content from OpenAI.
 *           example: "The main ideas include..."
 *     FlashcardRequest:
 *       type: object
 *       properties:
 *         num:
 *           type: integer
 *           description: The number of flashcards to create.
 *           example: 5
 *         prompt:
 *           type: string
 *           description: The transcript content to create flashcards from.
 *           example: "This is a detailed transcript of the lesson..."
 *     FlashcardResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           term:
 *             type: string
 *             description: The term or concept for the flashcard.
 *             example: "Photosynthesis"
 *           definition:
 *             type: string
 *             description: The definition or explanation for the term.
 *             example: "The process by which green plants and some other organisms use sunlight to synthesize foods..."
 *     TranscribeRequest:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: The audio file to be transcribed.
 *     TranscribeResponse:
 *       type: object
 *       properties:
 *         response:
 *           type: object
 *           description: The transcription result from OpenAI.
 *           properties:
 *             text:
 *               type: string
 *               description: The transcribed text.
 *               example: "This is the transcribed text of the audio."
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 * 
 * /api/generation/summarize:
 *   post:
 *     summary: Summarize a transcript
 *     description: Provides a summary of the given transcript using OpenAI's API.
 *     tags:
 *       - Generation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Transcript content to summarize
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SummarizeRequest'
 *     responses:
 *       200:
 *         description: Summary of the transcript
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SummarizeResponse'
 * 
 * /api/generation/make-flashcard:
 *   post:
 *     summary: Create flashcards from a transcript
 *     description: Creates flashcards based on the given transcript using OpenAI's API.
 *     tags:
 *       - Generation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Transcript content to create flashcards from
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FlashcardRequest'
 *     responses:
 *       200:
 *         description: Flashcards created from the transcript
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlashcardResponse'
 * 
 * /api/generation/transcribe:
 *   post:
 *     summary: Transcribe an audio file
 *     description: Transcribes audio content using OpenAI's Whisper model.
 *     tags:
 *       - Generation
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Audio file to transcribe
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/TranscribeRequest'
 *     responses:
 *       200:
 *         description: Transcription result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TranscribeResponse'
 */
