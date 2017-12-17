var session = require('../config/neo4j.db');
var mongoose = require('mongoose');
var assert = require('assert');
var Promise = require('bluebird');
var User = require('../model/user.model');
var Archive = require('../model/archive.model');
var Blog = require('../model/blog.model');
var Author = require('../model/author.model');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

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

    // before((done) => {
    //     console.log('Connect to databases')
    //     mongoose.connect('mongodb://localhost/news_blog');
    //     mongoose.connection.once('open', () => { 
    //         done();
    //         //console.log('Connected!'); 
    //     }).on('error', (error) => {
    //         //console.warn('Warning', error);
    //     });
    // });
      
    before((done) => {
        //console.log('Drop all databases');
        const { users, archives, blogs, authors } = mongoose.connection.collections;
        users.drop(() => {
          archives.drop(() => {
            blogs.drop(() => {
              authors.drop(() => {
                session.run('MATCH (n) DETACH DELETE n');
                //console.log('Dropped!');
                done();
              });
            });
          });
        });
    });

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

    it('Neo4j: GraphDB:: Creating nodes and relations', (done) => {
        let all = null;

        data = []
        data[0] = Promise.map(blogs, (blog) => {
            const id = blog._id.toString();
            const title = blog._title;
            const author = blog._author._id.toString();
            const timestamp = blog._timestamp.toString();
            const summary = blog._summary;
            const text = blog._text;
            const blogNode = '(blog:Blog { _id: {id}, title: {title}, author: {author}, timestamp: {timestamp} })'
            const summaryNode = '(s:Summary { summary: {summary} })';
            const textNode = '(t:Text { text: {text} })';
            const summaryRel = '-[hs:HAS_SUMMARY]->';
            const textRel = '-[ht:HAS_TEXT]->'
            const query = 'CREATE ' + blogNode + summaryRel + summaryNode + textRel + textNode;
            return session.run(query, {
                id: id, 
                title: title, 
                author: author, 
                timestamp: timestamp, 
                summary: summary, 
                text: text
            });
        }); 

        data[1] = Promise.map(authors, (author) => {
            const id = author._id.toString();
            const name = author._name;
            const query = 'CREATE (author:Author { _id: {id}, name: {name} })';
            return session.run(query, {id: id, name: name});
        });

        all = Promise.all([
            data[0],
            data[1]
        ]);

        all.then((data) => {
            done();
            session.close();
            //console.log(data);
        });
    });

    it('Neo4j: GraphDB:: Creating relations with nodes', (done) => {
        let all = null;

        data = []
        data[0] = Promise.map(blogs, (blog) => {
            const id = blog._id.toString();
            const author = blog._author._id.toString();
            const timestamp = blog._timestamp.toString();
            const match = 'MATCH (blog:Blog { _id: {id} }), (author:Author { _id: {author} })';
            const createdBy = 'CREATE UNIQUE (author)-[:CREATED { created_on: {timestamp} }]->(blog)';
            const query = match + createdBy;
            return session.run(query, {id: id, author: author, timestamp: timestamp});
        }); 

        all = Promise.all([
            data[0],
        ]);

        all.then((data) => {
            done();
            session.close();
            //console.log(data);
        });
    });
});