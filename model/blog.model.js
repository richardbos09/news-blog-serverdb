const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    _title: {
        type: String,
        required: true
    },
    _author: {
        type: Schema.Types.ObjectId,
        ref: 'author',
        required: true
    },
    _timestamp: {
        type: Date,
        required: true
    },
    _summary: {
        type: String,
        required: true
    },
    _text: {
        type: String,
        required: true
    }
});

const Blog = mongoose.model('blog', BlogSchema);

module.exports = Blog;