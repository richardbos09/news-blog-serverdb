const mongoose = require('mongoose');
const config = require('./env/env');

// Gebruik es6 promises ipv mongoose mpromise
mongoose.Promise = global.Promise;

mongoose.connect(config.dburl);
var connection = mongoose.connection.once('open', () =>  {
    console.log('Connected to Mongo on ' + config.dburl)
    console.log('Connected to Neo4j on ' + config.env.neoDbUri)
}).on('error', (error) => {
    console.warn('Warning', error.toString());
});

module.exports = connection;

console.log('Connected to Mongo on ' + config.dburl)