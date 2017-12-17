//
// ./api/v1/blog.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var neo4jdb = require('../config/neo4j.db');
var Archive = require('../model/archive.model');
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
    const year = new Date(data._timestamp).getFullYear();
    const month = new Date(data._timestamp).getMonth();
    const datestamp = new Date(year, month);
    const blog = new Blog({
        _title: data._title,
        _timestamp: data._timestamp,
        _summary: data._summary,
        _text: data._text
    });
    let newAuthor = false;

    const authorPromise = Author.findById(data._author._id).then((author) => {
        if(author) {
            return blog._author = author;
        } else {
            newAuthor = true;
            return blog._author = new Author({  
                _name: data._author._name 
            });
        }
    });

    const archivePromise = Archive.findOne({ _datestamp: datestamp}).then((archive) => {
        if(archive) {
            archive._blogs.push(blog);
            return archive;
        } else {
            archive = new Archive({
                _datestamp: datestamp
            });
            archive._blogs.push(blog);
            return archive;
        }
    });

    Promise.all([
        archivePromise.then((archive) => {
            archive.save();
        }),
        authorPromise.then((author) => {
            if(newAuthor) {
                const id = author._id.toString();
                const name = author._name;
                const create = 'CREATE (author:Author { _id: {id}, name: {name} })';
                neo4jdb.run(create, {id: id, name: name})
            }
            author.save();
        })
    ]).then(() => {
        blog.save().then((blog) => {
            const id = blog._id.toString();
            const title = blog._title;
            const author = blog._author._id.toString();
            const timestamp = blog._timestamp.toString();
            const summary = blog._summary;
            const text = blog._text;
            const query = `
                MATCH (author:Author { _id: {author} }) 
                CREATE (blog:Blog { _id: {id}, title: {title}, author: {author}, timestamp: {timestamp} }), (s:Summary { summary: {summary} }), (t:Text { text: {text} })
                CREATE UNIQUE (author)-[:CREATED { created_on: {timestamp}}]->(blog)-[:HAS_SUMMARY]->(s)-[ht:HAS_TEXT]->(t)
            `;
            neo4jdb.run(query, {id: id, title: title, author: author, timestamp: timestamp, summary: summary, text: text});
            res.status(200).send(blog);
        }).catch((error) => {
            res.status(401).json(error);
        })
    }).then(() => {
        neo4jdb.close();
    });
});

//
// Wijzig een bestaande blog. De nieuwe info wordt gestuurd via de body van de request message.
// Er zijn twee manieren om de id van de blogs mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: PUT http://hostname:3000/api/v1/blogs/23
//
routes.put('/blogs/:id', function (req, res) {
    res.contentType('application/json');
    const data = req.body.data;
    const year = new Date(data._timestamp).getFullYear();
    const month = new Date(data._timestamp).getMonth();
    const datestamp = new Date(year, month);
    let blog = null
    let author = null;
    let promises = [
        promise = null,
        promise = null,
        promise = null
    ];
    let newAuthor = false;

    promises[0] = Author.findById(data._author._id).then((value) => {
        if(value) {
            return author = value;
        } else {
            newAuthor = true;
            return author = new Author({  
                _name: data._author._name 
            });
        }
    });

    promises[1] = Blog.findById(data._id).then((value) => {
        value._title = data._title;
        value._timestamp = data._timestamp;
        value._summary = data._summary;
        value._text = data._text;
        return blog = value;
    });

    promises[2] = Archive.findOne({ _datestamp: datestamp}).then((value) => {
        if(value) {
            return value;
        } else {
            return new Archive({
                _datestamp: datestamp
            });
        }
    });

    promises[0].then((value) => {
        if(newAuthor) {
            const id = value._id.toString();
            const name = value._name;
            const create = 'CREATE (author:Author { _id: {id}, name: {name} })';
            neo4jdb.run(create, {id: id, name: name})
        }
        value.save();
    }).then(() => {
        promises[1].then(value => {
            value._author = author;
            value.save().then((value) => {
                const id = value._id.toString();
                const title = value._title;
                const author = value._author._id.toString();
                const timestamp = value._timestamp.toString();
                const summary = value._summary;
                const text = value._text;
                const query = `
                    MATCH (a:Author), (b:Blog)-[:HAS_SUMMARY]->(s:Summary)-[:HAS_TEXT]->(t:Text)
                    WHERE a._id = {author} AND b._id = {id}
                    MERGE (a)-[u:UPDATED]->(b)
                    SET b.title = {title}, b.author = {author}, b.timestamp = {timestamp}, s.summary = {summary}, t.text = {text}, u.updated_on = {timestamp}
                `;
                neo4jdb.run(query, {id: id, title: title, author: author, timestamp: timestamp, summary: summary, text: text});
                res.send(value);
            }).catch((error) => {
                res.status(401).json(error);
            });
        }).then(() => {
            promises[2].then((value) => {
                value._blogs.push(blog);
                value.save();
            });
        });
    }).then(() => {
        neo4jdb.close();
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
    const id = req.params.id.toString();
    const query = `
        MATCH (blog:Blog)-[hs:HAS_SUMMARY]->(s:Summary)-[ht:HAS_TEXT]->(t:Text)
        WHERE blog._id = {id}
        DETACH DELETE blog, hs, s, ht, t
    `;

    Blog.findByIdAndRemove(id).then((blog) => {
        neo4jdb.run(query, {id: id});
        res.status(200).json(blog);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

module.exports = routes;