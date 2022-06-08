/* IMPORT */
const cassandra = require('cassandra-driver');
//const Pool = require('pg').Pool


/* ENVS */


const client = new cassandra.Client({
    contactPoints: [process.env.ContactPoint1, process.env.ContactPoint2, process.env.ContactPoint3],
    localDataCenter: process.env.datacenter,
    keyspace: process.env.keyspace,
});

const poolPDF = new Pool ({
    host: process.env.HOST_PDF,
    user: process.env.USER_PDF,
    password: process.env.PASS_PDF,
    database: process.env.DATABASE_PDF,
    port: process.env.PORT_PDF,
});



module.exports = {
    client,
};