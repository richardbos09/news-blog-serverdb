//
// server.js
//
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser')
var logger = require('morgan');

// MongoDb
var mongodb = require('./config/mongo.db');
var userroutes_v1 = require('./api/user.routes.v1');
var archiveroutes_v1 = require('./api/archive.routes.v1');
var blogroutes_v1 = require('./api/blog.routes.v1');
var authorroutes_v1 = require('./api/author.routes.v1');

// Neo4j: GraphDB
var neo4jdb = require('./config/neo4j.db');
var authorroutes_neo4j_v1 = require('./api/neo4j/author.routes.v1');
var blogroutes_neo4j_v1 = require('./api/neo4j/blog.routes.v1');

// var auth_routes_v1 = require('./api/auth/authentication.routes.v1');
var config = require('./config/env/env');
// var expressJWT = require('express-jwt');

var app = express();

// Met module.exports kunnen we variabelen beschikbaar maken voor andere bestanden.
// Je zou dit kunnen vergelijken met het 'public' maken van attributen in Java.
// Javascript neemt impliciet aan dat bovenaan ieder bestand de volgende regel staat.
// Deze kun je dus weglaten!
// Zie eventueel ook: https://www.sitepoint.com/understanding-module-exports-exports-node-js/  
module.exports = {};

// bodyParser zorgt dat we de body uit een request kunnen gebruiken,
// hierin zit de inhoud van een POST request.
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json

// Beveilig alle URL routes, tenzij het om /login of /register gaat.
// app.use(expressJWT({
//     secret: config.secretkey
// }).unless({
//     path: [
//         { url: '/api/v1/login', methods: ['POST'] },
//         { url: '/api/v1/register', methods: ['POST'] }
//     ]
// }));

// configureer de app
app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'))

// wanneer je je settings wilt controleren
// console.dir(config);
// console.log(config.dburl);

// Installeer Morgan als logger
app.use(logger('dev'));

// CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// MongoDB: Installeer de routers
app.use('/api/v1', userroutes_v1);
app.use('/api/v1', archiveroutes_v1);
app.use('/api/v1', blogroutes_v1);
app.use('/api/v1', authorroutes_v1);
// app.use('/api/v1', auth_routes_v1);

// Neo4j: GraphDB: Installeer de routers
app.use('/api/neo4j/v1', authorroutes_neo4j_v1);
app.use('/api/neo4j/v1', blogroutes_neo4j_v1);

// Errorhandler voor express-jwt errors
// Wordt uitgevoerd wanneer err != null; anders door naar next().
app.use(function (err, req, res, next) {
    // console.dir(err);
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    }
    res.status(401).send(error);
});

// Fallback - als geen enkele andere route slaagt wordt deze uitgevoerd. 
app.use('*', function (req, res) {
    res.status(400);
    res.json({
        'error': 'Deze URL is niet beschikbaar.'
    });
});

process.on('unhandledRejection', r => console.log(r));

// Installatie klaar; start de server.
app.listen(config.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));

    console.log('MongoDB:: GET, POST, PUT, DELETE');
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/users');
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/archives');
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/blogs');
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/authors');

    console.log('Neo4j: GraphDB:: GET, POST, PUT, DELETE');
    console.log('Zie bijvoorbeeld http://localhost:3000/api/neo4j/v1/authors');
    console.log('Zie bijvoorbeeld http://localhost:3000/api/neo4j/v1/blogs');
});

// Voor testen met mocha/chai moeten we de app exporteren.
module.exports = app;