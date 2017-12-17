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

chai.use(chaiHttp);

describe('Test api functionality in MongoDB', () => {
    const headers = { 'Content-Type': 'application/json' };

    const author = new Author({ _name: 'Richard' });
    const blog = new Blog({ 
        _title: 'Blog Post 1', _author: author, _timestamp: new Date(1512464400000),
        _summary: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
        _text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.'
    });

    before((done) => {
        const { users, archives, blogs, authors } = mongoose.connection.collections;
        users.drop(() => {
          archives.drop(() => {
            blogs.drop(() => {
              authors.drop(() => {
                session.run('MATCH (n) DETACH DELETE n');
                done();
              });
            });
          });
        });
    });

    after((done) => {
        const { users, archives, blogs, authors } = mongoose.connection.collections;
        users.drop(() => {
          archives.drop(() => {
            blogs.drop(() => {
              authors.drop(() => {
                session.run('MATCH (n) DETACH DELETE n');
                done();
              });
            });
          });
        });
    });

    it('MongoDB GET:: http://hostname:3000/api/v1/blogs', (done) => {
        chai.request(server).get('/api/v1/blogs').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });

    it('MongoDB GET:: http://hostname:3000/api/v1/blogs/:id', (done) => {
        blog.save((err, blog) => { 
            chai.request(server).get('/api/v1/blogs/' + blog._id).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql(blog._id.toString());
                res.body.should.have.property('_title');
                res.body.should.have.property('_author');
                res.body.should.have.property('_timestamp');
                res.body.should.have.property('_summary');
                res.body.should.have.property('_text');
                done();
            });
        });
    });

    it('MongoDB POST:: http://hostname:3000/api/v1/blogs', (done) => {
        chai.request(server).post('/api/v1/blogs').send({
            headers: headers,
			data: blog
        }).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_title');
            res.body.should.have.property('_author');
            res.body.should.have.property('_timestamp');
            res.body.should.have.property('_summary');
            res.body.should.have.property('_text');
            done();
        });
    });

    it('MongoDB PUT:: http://hostname:3000/api/v1/blogs/:id', (done) => {
        const newblog = new Blog({ 
            _id: blog._id, _title: 'Blog Post 2', _author: author, _timestamp: new Date(1512464400000),
            _summary: 'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
            _text: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.'
        });

        blog.save((err, blog) => {
            chai.request(server).put('/api/v1/blogs/' + blog._id).send({
                headers: headers,
			    data: newblog
            }).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_title').eql('Blog Post 2');
                done();
            });
        });
    });

    it('MongoDB DELETE:: http://hostname:3000/api/v1/blogs/:id', (done) => {
        blog.save((err, blog) => {
            chai.request(server).delete('/api/v1/blogs/' + blog._id).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                Blog.findById(res.body._id).then((blog) => {
                    assert(blog === null);
                    done();
                })
            });
        });
    });
});