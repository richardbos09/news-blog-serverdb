const mongoose = require('mongoose');
const User = require('../model/user.model');
const Archive = require('../model/archive.model');
const Blog = require('../model/blog.model');
const Author = require('../model/author.model');

mongoose.Promise = global.Promise;

before((done) => {
  console.log('Connect to database')
  mongoose.connect('mongodb://localhost/news_blog');
  mongoose.connection.once('open', () => { 
      console.log('Connected!');
      done(); 
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
          console.log('Dropped!');
          done();
        });
      });
    });
  });
});