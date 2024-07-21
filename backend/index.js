const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const deckRouter = require('./routes/deckrouter');
const multicardRouter = require('./routes/MultichoiceRouter'); 
const flashcardRouter = require('./routes/Flashcardrouter'); 
const authRouter = require('./routes/authentication'); 
const transcriptRouter = require('./routes/transcripts'); 
const generation = require('./routes/generation');
const authMiddleware = require('./middleware/auth');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const uri = process.env.ATLAS_URI;

app.use('/api/decks', authMiddleware, deckRouter);
app.use('/api/multicards', authMiddleware, multicardRouter); 
app.use('/api/flashcards', authMiddleware, flashcardRouter); 
app.use('/api/auth', authRouter); 
app.use('/api/transcripts', authMiddleware, transcriptRouter); 

app.use('/api/generation', authMiddleware, generation);

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ' + error);
    });