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

    Archive.find().then(function (archives) {
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
    res.contentType('application/json');
    const id = req.params.id;

    Archive.findById(id).then((archive) => {
        res.status(200).json(archive);
    }).catch((error) => {
        res.status(401).json(error);
    });
});

//
// Voeg een archive toe. De nieuwe info wordt gestuurd via de body van de request message.
// Vorm van de URL: POST http://hostname:3000/api/v1/archives
//
routes.post('/archives', function (req, res) {
    // Nieuwe archive wordt alleen toegevoegd bij een blog post of put
    res.contentType('application/json');
    const body = req.body;
    const archive = new Archive({
        _datestamp: body._datestamp
    });

    archive._blogs.push(body.blog);

    archive.save().then((archive) => {
        res.send(archive);
    }).catch((error) => {
        res.status(401).json(error);
    });
});

//
// Wijzig een bestaande archive. De nieuwe info wordt gestuurd via de body van de request message.
// Er zijn twee manieren om de id van de archives mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: PUT http://hostname:3000/api/v1/archives/23
//
routes.put('/archives/:id', function (req, res) {
    // Bestaande archive wordt alleen verandert bij een blog delete
    res.contentType('application/json');
    const id = req.params.id;
    const body = req.body;
    
    Archive.findById(id).then((archive) => {
        archive._blogs.findByIdAndRemove(body._id).then((blog) => {
            res.send(blog);
        }).catch((error) => {
            res.status(401).json(error);
        });
    }).catch((error) => {
        res.status(401).json(error);
    });;
});

//
// Verwijder een bestaande archive.
// Er zijn twee manieren om de id van de users mee te geven: via de request parameters (doen we hier)
// of als property in de request body.
// 
// Vorm van de URL: DELETE http://hostname:3000/api/v1/archives/23
//
routes.delete('/archives/:id', function (req, res) {
    // Bestaande archive wordt alleen verwijdert wanneer alle blogs deleted zijn
    res.contentType('application/json');
    const id = req.params.id;

    Archive.findByIdAndRemove(id).then((archive) => {
        res.status(200).json(archive);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

module.exports = routes;