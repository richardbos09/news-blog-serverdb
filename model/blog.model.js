const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'author',
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const Blog = mongoose.model('blog', BlogSchema);

module.exports = Blog;