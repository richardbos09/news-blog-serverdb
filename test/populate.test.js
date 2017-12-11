const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../model/user.model');
const Archive = require('../model/archive.model');
const Blog = require('../model/blog.model');
const Author = require('../model/author.model');

let authors = [
    author = null,
    author = null,
    author = null,
];
let blogs = [
    blog = null,
    blog = null,
    blog = null,
];
let archives = [
    archive = null,
    archive = null,
    archive = null,
];

describe('Populate into database', () => {
    it('Creating collections', (done) => {
        authors[0] = new Author({ _name: 'Richard' });
        authors[1] = new Author({ _name: 'Danny' });
        authors[2] = new Author({ _name: 'Hugo' });
        blogs[0] = new Blog({ _title: 'Blog Post 1', _author: authors[0], _timestamp: new Date(1512464400000),
            _summary: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
            _text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.'
        });
        blogs[1] = new Blog({ _title: 'Blog Post 2', _author: authors[1], _timestamp: new Date(1515578400000),
            _summary: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
            _text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.'
        });
        blogs[2] = new Blog({ _title: 'Blog Post 3', _author: authors[2], _timestamp: new Date(1518692400000),
            _summary: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
            _text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.'
        });
        archives[0] = new Archive({ _datestamp: new Date(2017, 11) });
        archives[1] = new Archive({ _datestamp: new Date(2018, 0) });
        archives[2] = new Archive({ _datestamp: new Date(2018, 1) });
        
        archives[0]._blogs.push(blogs[0]);
        archives[1]._blogs.push(blogs[1]);
        archives[2]._blogs.push(blogs[2]);

        Promise.all([
            archives[0].save(),
            archives[1].save(),
            archives[2].save(),
            blogs[0].save(),
            blogs[1].save(),
            blogs[2].save(),
            authors[0].save(),
            authors[1].save(),
            authors[2].save(),
        ]).then(() => {
            return done();
        });
    });
});