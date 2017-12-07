const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
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

// const blog = new Blog({
//     title: 'Blog Post 1',
//     // author: '1',
//     timestamp: new Date(1512464400000),
//     summary: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
//     text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.'
// }).save();

module.exports = Blog;