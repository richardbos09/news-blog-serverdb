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
    console.log('test');
    
    // res.contentType('application/json');

    // Author.find().then(function (authors) {
    //     res.status(200).json(authors);
    // }).catch((error) => {
    //     res.status(400).json(error);
    // });
});

module.exports = routes;