var session = require('../config/neo4j.db');
var mongoose = require('mongoose');
var User = require('../model/user.model');
var Archive = require('../model/archive.model');
var Blog = require('../model/blog.model');
var Author = require('../model/author.model');

mongoose.Promise = global.Promise;

before((done) => {
  console.log('Connect to database')
  mongoose.connect('mongodb://localhost/news_blog');
  mongoose.connection.once('open', () => { 
      done();
      console.log('Connected!'); 
  }).on('error', (error) => {
      console.warn('Warning', error);
  });
});

before((done) => {
  console.log('Drop all collections');
  const { users, archives, blogs, authors } = mongoose.connection.collections;
  users.drop(() => {
    archives.drop(() => {
      blogs.drop(() => {
        authors.drop(() => {
          done();
          session.run('MATCH (n) DETACH DELETE n');
          console.log('Dropped!');
        });
      });
    });
  });
});