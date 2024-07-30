const router = require('express').Router();
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth')
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, username, password, role } = req.body;

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            password,
            role
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: '30d',
        });

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
                expiresIn: '30d',
            });

            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role,
                token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLoginDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: "Password@123"
 *     UserRequestDTO:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - username
 *         - password
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the user.
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: The last name of the user.
 *           example: "Doe"
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: "john.doe@example.com"
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: "johndoe"
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: "Password@123"
 *         role:
 *           type: string
 *           description: The role of the user (e.g., 'USER', 'ADMIN').
 *           example: "USER"
 *     UserResponseDTO:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the user.
 *           example: "60d5c51f6b1e8c001f1e4a30"
 *         firstName:
 *           type: string
 *           description: The first name of the user.
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: The last name of the user.
 *           example: "Doe"
 *         email:
 *           type: string
 *           description: The email address of the user.
 *           example: "john.doe@example.com"
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: "johndoe"
 *         role:
 *           type: string
 *           description: The role of the user (e.g., 'USER', 'ADMIN').
 *           example: "USER"
 *         token:
 *           type: string
 *           description: The JWT token for authentication.
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - BearerAuth: []
 * 
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Registers a new user and returns a JWT token.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User object that needs to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequestDTO'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 * 
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Credentials for user authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginDTO'
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 *
 * /api/auth/delete:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
