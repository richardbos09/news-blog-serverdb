//
// ./api/v1/blog.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Blog = require('../model/blog.model');
var Author = require('../model/author.model');

//
// Geef een lijst van alle blogs.
//
routes.get('/blogs', function (req, res) {
    res.contentType('application/json');

    Blog.find().then(function (blogs) {
        res.status(200).json(blogs);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

//
// Retourneer één specifieke blog. Hier maken we gebruik van URL parameters.
// Vorm van de URL: http://hostname:3000/api/v1/blogs/23
//
routes.get('/blogs/:id', function (req, res) {
    res.contentType('application/json');
    const id = req.params.id

    Blog.findById(id).then((blog) => {
        res.status(200).json(blog);
    }).catch((error) => {
        res.status(401).json(error);
    });
});

//
// Voeg een blog toe. De nieuwe info wordt gestuurd via de body van de request message.
// Vorm van de URL: POST http://hostname:3000/api/v1/blogs
//
routes.post('/blogs', function (req, res) {
    res.contentType('application/json');
    const data = req.body.data;
    let blog = new Blog({
        _title: data._title,
        _timestamp: data._timestamp,
        _summary: data._summary,
        _text: data._text
    });
    let author = null;

    Author.findById(data._author._id).then((a) => {
        if(data._author._id) {
            author = a;
            blog._author = author;
        } else {
            author = new Author({  _name: data._author._name })
            blog._author = author;
        }
    }).then(() => {
        Promise.all([
            author.save(),
            blog.save().then((blog) => {
                res.send(blog);
            }).catch((error) => {
                res.status(401).json(error);
            })
        ]);
    })
});

//
// Wijzig een bestaande blog. De nieuwe info wordt gestuurd via de body van de request message.
// Er zijn twee manieren om de id van de blogs mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: PUT http://hostname:3000/api/v1/blogs/23
//
routes.put('/users/:id', function (req, res) {
    res.contentType('application/json');
    const id = req.params.id;
    const body = req.body;

    Blog.findById(id).then((blog) => {
        blog._title = body._title,
        blog._author = body._author,
        blog._timestamp = body._timestamp,
        blog._summary = body._summary,
        blog._text = body._text
    }).save().then((blog) => {
        res.send(blog);
    }).catch((error) => {
        res.status(401).json(error);
    });
});

//
// Verwijder een bestaande blog.
// Er zijn twee manieren om de id van de users mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: DELETE http://hostname:3000/api/v1/blogs/23
//
routes.delete('/blogs/:id', function (req, res) {
    res.contentType('application/json');
    const id = req.params.id;

    Blog.findByIdAndRemove(id).then((blog) => {
        res.status(200).json(blog);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

module.exports = routes;