const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../model/user.model');
const Archive = require('../model/archive.model');
const Blog = require('../model/blog.model');
const Author = require('../model/author.model');

describe('Populate into database', () => {
    it('Creating collections', (done) => {
        const author = new Author({
            name: 'Richard'
        });
        const blog = new Blog({
            title: 'Blog Post 1',
            author: author,
            timestamp: new Date(1512464400000),
            summary: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
            text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.'
        });
        const archive = new Archive({
            datestamp: new Date(2017, 11)
        });
        
        archive.blogs.push(blog);

        Promise.all([
            archive.save(),
            blog.save(),
            author.save()
        ]).then(() => {
            return done();
        });
    });
});