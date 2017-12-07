//
// ./api/v1/author.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Author = require('../model/author.model');

//
// Geef een lijst van alle authors.
//
routes.get('/authors', function (req, res) {
    res.contentType('application/json');

    Author.find({

    }).then(function (authors) {
        res.status(200).json(authors);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

//
// Retourneer één specifieke author. Hier maken we gebruik van URL parameters.
// Vorm van de URL: http://hostname:3000/api/v1/authors/23
//
routes.get('/authors/:id', function (req, res) {

});

//
// Voeg een author toe. De nieuwe info wordt gestuurd via de body van de request message.
// Vorm van de URL: POST http://hostname:3000/api/v1/authors
//
routes.post('/authors', function (req, res) {

});

//
// Wijzig een bestaande author. De nieuwe info wordt gestuurd via de body van de request message.
// Er zijn twee manieren om de id van de authors mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: PUT http://hostname:3000/api/v1/authors/23
//
routes.put('/users/:id', function (req, res) {

});

//
// Verwijder een bestaande author.
// Er zijn twee manieren om de id van de users mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: DELETE http://hostname:3000/api/v1/authors/23
//
routes.delete('/authors/:id', function (req, res) {

});

module.exports = routes;