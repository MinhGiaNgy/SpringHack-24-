# SpringHack-24-

## Description
A teaching app built using MERNstack

## Features

- User Authentication and Authorization
- CRUD Operations
- Responsive Design
- RESTful API
- State Management with Redux (if used)
- Form Validation
- Error Handling

## Technologies Used

- **MongoDB**: NoSQL database for storing application data
- **Express.js**: Back-end framework for building the server and RESTful API
- **React**: Front-end library for building user interfaces
- **Node.js**: JavaScript runtime for the server
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **Bootstrap CSS**: CSS frameworks for styling (if used)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MinhGiaNgy/SpringHack-24-.git
   cd SpringHack-24-
   ```

2. **Install dependencies**

   - Back-end dependencies

     ```bash
     cd backend/
     npm install express cors dotenv
     npm install mongoose 
     npm install -y
     ```
    

3. **Set up environment variables**

   Obtain the .env key from author.

4. **Run the application**

   - Start the back-end server

     ```bash
     cd backend
     npm run dev
     ```

   - Start the front-end development server

     ```bash
     cd ../frontend
     npm start
     ```

5. **API Documentation**
   - Frontend APIs
   - For decks: ('./routes/deckrouter');
   - For cards: ('./routes/cards')
   - For multichoice cards: ('./routes/MultichoiceRouter'); 
   - For Flashcard: ('./routes/Flashcardrouter'); 
   - For Auth: ('./routes/authentication'); 
   - For Transcripts: ('./routes/transcripts'); 
   - For generation: ('./routes/generation');
  
6. **Access the application**
   Open your browser and go to http://localhost:5000 to see the application in action.

## Folder Structure

SpringHack-24
│
├── backend
│   ├── index.js
│   ├── config.js
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   └── package.json
│
├── README.md
└── .gitignore



