const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    _name: {
        type: String,
        required: true
    }
});

const Author = mongoose.model('author', AuthorSchema);

module.exports = Author;