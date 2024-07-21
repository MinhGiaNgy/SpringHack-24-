const express = require('express');
const mongoose = require('mongoose');
const { PORT, mongoDBURL } = require('./config');
const deckRouter = require('./routes/deckrouter');
const multicardRouter = require('./routes/MultichoiceRouter'); 
const flashcardRouter = require('./routes/Flashcardrouter'); 
const authRouter = require('./routes/authentication'); 
const transcriptRouter = require('./routes/transcripts'); 
const generation = require('./routes/generation');
const authMiddleware = require('./middleware/auth'); 

const app = express();
app.use(express.json());


app.use('/api/decks', authMiddleware, deckRouter);
app.use('/api/multicards', authMiddleware, multicardRouter); 
app.use('/api/flashcards', authMiddleware, flashcardRouter); 
app.use('/api/auth', authRouter); 
app.use('/api/transcripts', authMiddleware, transcriptRouter); 

app.use('/api/generation', authMiddleware, generation);

mongoose
    .connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB: ' + error);
    });
