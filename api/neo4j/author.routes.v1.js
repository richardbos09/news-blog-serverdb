//
// Neo4j: GraphDB
// ./api/v1/author.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var neo4jdb = require('../../config/neo4j.db');
var Author = require('../../model/neo4j/author.model');

//
// Neo4j: GraphDB
// Geef een lijst van alle authors.
//
routes.get('/authors', function (req, res) {
    res.contentType('application/json');
    const query = 'MATCH (author:Author) RETURN author';
    let authors = [];

    neo4jdb.run(query).then((result) => {
        result.records.forEach((record) => {
            const id = record._fields[0].properties._id.toString();
            const name = record._fields[0].properties.name.toString();
            const author = new Author(id, name);
            authors.push(author);
        });
        neo4jdb.close();
    }).then(() => {
        res.status(200).json(authors);
    }).catch((error) => {
        res.status(400).json(error);
    })
});

//
// Neo4j; GraphDB
// Retourneer één specifieke author. Hier maken we gebruik van URL parameters.
// Vorm van de URL: http://hostname:3000/api/v1/authors/23
//
routes.get('/authors/:id', function (req, res) {
    res.contentType('application/json');
    const id = req.params.id.toString();
    const query = 'MATCH (author:Author) WHERE author._id = {id} RETURN author';
    let author = null;

    neo4jdb.run(query, {id: id}).then((result) => {
        result.records.forEach((record) => {
            const id = record._fields[0].properties._id.toString();
            const name = record._fields[0].properties.name.toString();
            author = new Author(id, name);
        });
        neo4jdb.close();
    }).then(() => {
        res.status(200).json(author);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

module.exports = routes;