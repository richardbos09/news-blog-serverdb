var session = require('../config/neo4j.db');
var mongoose = require('mongoose');
var assert = require('assert');
var Promise = require('bluebird');
var User = require('../model/user.model');
var Archive = require('../model/archive.model');
var Blog = require('../model/blog.model');
var Author = require('../model/author.model');

describe('Populating databases in MongoDB & Neo4j: GraphDB', () => {
    authors = [];
    authors[0] = new Author({ _name: 'Richard' });
    authors[1] = new Author({ _name: 'Danny' });
    authors[2] = new Author({ _name: 'Hugo' });

    blogs = [];
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

    archives = [];
    archives[0] = new Archive({ _datestamp: new Date(2017, 11) });
    archives[1] = new Archive({ _datestamp: new Date(2018, 0) });
    archives[2] = new Archive({ _datestamp: new Date(2018, 1) });

    it('MongoDB:: Creating collections', (done) => {
        archives[0]._blogs.push(blogs[0]);
        archives[1]._blogs.push(blogs[1]);
        archives[2]._blogs.push(blogs[2]);

        data = [];
        data[0] = Promise.map(archives, (archive) => {
            return archive.save();
        });
        data[1] = Promise.map(blogs, (blog) => {
            return blog.save();
        });
        data[2] = Promise.map(authors, (author) => {
            return author.save();
        });

        all = Promise.all([
            data[0],
            data[1],
            data[2],
        ]);

        all.then((data) => {
            done();
            //console.log(data);
        });
    });

    it('Neo4j: GraphDB:: Creating nodes', (done) => {
        let all = null;

        data = []
        data[0] = Promise.map(authors, (author) => {
            const id = author._id.toString();
            const name = author._name;
            const create = 'CREATE (author:Author { _id: {id}, name: {name} })';
            return session.run(create, {id: id, name: name});
        });

        all = Promise.all([
            data[0]
        ]);

        all.then((data) => {
            done();
            session.close();
            //console.log(data);
        });
    });
});