const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const Author = mongoose.model('author', AuthorSchema);

// Add 'dummy' data (every time you require this file!)
// const authors = [
//     author = null, 
//     author = null,
//     author = null
// ];
// authors[0] = new Author({
//     name: 'Richard'
// }).save();
// authors[1] = new Author({
//     name: 'Danny'
// }).save();
// authors[2] = new Author({
//     name: 'Hugo'
// }).save();

module.exports = Author;