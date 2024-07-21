const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const Account = require('./account.model');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: 1,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: 1
    },
    decks: [{
        type: Schema.Types.ObjectId, 
        ref: 'Deck'
    }],
    transcripts: [{
        type: Schema.Types.ObjectId,
        ref: 'Transcript'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('Transcript').deleteMany({ user: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

const User = Account.discriminator('User', userSchema);
module.exports = User;