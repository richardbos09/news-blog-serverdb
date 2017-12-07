//
// ./api/v1/archive.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Archive = require('../model/archive.model');

//
// Geef een lijst van alle archives.
//
routes.get('/archives', function (req, res) {
    res.contentType('application/json');

    Archive.find({

    }).then(function (archives) {
        res.status(200).json(archives);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

//
// Retourneer één specifieke archive. Hier maken we gebruik van URL parameters.
// Vorm van de URL: http://hostname:3000/api/v1/archives/23
//
routes.get('/archives/:id', function (req, res) {

});

//
// Voeg een archive toe. De nieuwe info wordt gestuurd via de body van de request message.
// Vorm van de URL: POST http://hostname:3000/api/v1/archives
//
routes.post('/archives', function (req, res) {

});

//
// Wijzig een bestaande archive. De nieuwe info wordt gestuurd via de body van de request message.
// Er zijn twee manieren om de id van de archives mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: PUT http://hostname:3000/api/v1/archives/23
//
routes.put('/users/:id', function (req, res) {

});

//
// Verwijder een bestaande archive.
// Er zijn twee manieren om de id van de users mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: DELETE http://hostname:3000/api/v1/archives/23
//
routes.delete('/archives/:id', function (req, res) {

});

module.exports = routes;