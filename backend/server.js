const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const { swaggerUi, swaggerDocument } = require('./swagger');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const uri = process.env.ATLAS_URI;

app.use('/api/decks', authMiddleware, require('./routes/decks'));
app.use('/api/cards', authMiddleware, require('./routes/cards'));
app.use('/api/multicards', authMiddleware, require('./routes/multicards')); 
app.use('/api/flashcards', authMiddleware, require('./routes/flashcards')); 
app.use('/api/auth', require('./routes/authentication')); 
app.use('/api/transcripts', authMiddleware, require('./routes/transcripts')); 
app.use('/api/generation', authMiddleware, require('./routes/generation'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose
    .connect(uri, { })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ' + error);
    });
