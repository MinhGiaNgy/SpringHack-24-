const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transcriptSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'], 
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    summary: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User'
    }

}, {
    timestamps: true
});

const Transcript = mongoose.model('Transcript', transcriptSchema);
module.exports = Transcript;