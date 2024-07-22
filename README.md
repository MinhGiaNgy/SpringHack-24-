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
     npm install express cors dotenv jsonwebtoken bcryptjs axios mongoose
     npm install --save-dev nodemon
     ```

3. **Set up environment variables**

   Obtain the .env file from author and place it in folder ./backend

4. **Run the application**
   - Add the following to package.json
     
     ```json
     {
        "scripts": {
          "start": "node index.js",
          "dev": "nodemon index.js"
        }
     }
     ```

   - Start the back-end development server

     ```bash
     cd backend
     npm run dev
     ```

   - Start the front-end development server

     ```bash
     cd ../frontend
     npm start
     ```

6. **API Documentation**
   - APIs: http://localhost:5000
      - For decks: /api/decks
      - For cards: /api/cards
      - For multichoice cards: /api/multicards
      - For Flashcard: /api/flashcards
      - For Auth: /api/auth
      - For Transcripts: /api/transcripts
      - For generation: /api/generation

   - When a user logs in, the JWT token must be saved in local storage.
   - Except for calling login and sign-up routes, all other routes must have a JWT token inside headers as such:
     
   ```javascript
   {
      'headers': {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
      }
   }
   ```
    
   - Sample APIs
      - Login: POST /api/auth/signin
        
      ```json
      {
         "email": "string",
         "password": "string"
      }
      ```
      - Signup: POST /api/auth/signup
        
      ```json
      {
         "email": "string",
         "username": "string",
         "password": "string",
         "role": "USER",
         "firstName": "string",
         "lastName": "string"
      }
      ```

      - Create card: POST /api/cards

      ```json
      {
          "deck": "669ced1c8739729ee0e6c24c",
          "type": "Multicard",
          "question": "Is computer science dead?",
          "choiceNumber": 2,
          "choices": [
              "True",
              "False"
          ]
      }
      ```

      ```json
      {
          "deck": "669ced1c8739729ee0e6c24c",
          "type": "Flashcard",
          "term": "Apple",
          "definition": "A tech company"
      }
      ```

      - Create deck: POST /api/decks

      ```json
      {
         "name": "My first deck"
      }
      ```

      - Generate flashcards: POST /api/generation/make-flashcard

      ```json
      {
         "num": 10,
         "prompt": "string"
      }
      ```

      - Summarize text: POST /api/generation/summarize
    
      ```json
      {
         "prompt": "string"
      }
      ```
  
7. **Access the application**
   
   Open your browser and go to http://localhost:3000 to see the application in action.

## Folder Structure

```
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
```


