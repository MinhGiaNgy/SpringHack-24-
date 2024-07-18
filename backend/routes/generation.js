const express = require('express');
const axios = require('axios');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');

const authMiddleware = require('../middleware/auth')

require('dotenv').config();

// @route   POST /api/openai/summarize
// @desc    Summarize lessons using OpenAI API
// @access  Private
router.post('/summarize', async (req, res) => {
    const template = "You are a teacher. The user will give you a transcript of a lesson and you have to summarize it for them. In your summary, you can use bullet points to make the ideas clear, understandable but still accurate.";
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

// @route   POST /api/openai/make-flashcard
// @desc    Generate flashcards using OpenAI API
// @access  Private
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

const upload = multer({ dest: 'uploads/' });

// @route   POST /api/openai/transcribe
// @desc    Speech to text using OpenAI API
// @access  Private
router.post('/transcribe', upload.single('audio'), async (req, res) => {
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

        // Clean up the uploaded file
        fs.unlinkSync(audioPath);

        res.json({ response: response.data });
    } catch (error) {
        console.error('Error calling OpenAI API: ', error);
        res.status(500).json({ error: 'Error calling OpenAI API' });
    }
});

module.exports = router;