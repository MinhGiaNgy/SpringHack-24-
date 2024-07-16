const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        trim: true, 
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        minlength: 3 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function(value) {
                return /(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*\d)/.test(value);
            },
            message: 'Password must contain at least one special character, one uppercase letter, and one digit'
        }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true
    }
}, {
    timestamps: true 
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;