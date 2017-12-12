const neo4j = require('neo4j-driver').v1;
const config = require('./env/env');

const driver = neo4j.driver(
    config.env.neoDbUri, 
    neo4j.auth.basic(config.env.neoDbUser, config.env.neoDbPassword)
);

const session = driver.session();

module.exports = session;