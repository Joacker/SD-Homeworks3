"use strict";
/* IMPORTS */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cassandra = require('cassandra-driver');
const dse = require('dse-driver');
//-------------------------------------------

/* CONFIGS */

const app = express();
dotenv.config();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 3000;
var host = process.env.PORT || '0.0.0.0';
//let authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'Password');
///////////////////////////////////////////////////////////////
var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;

const client = new cassandra.Client({
  contactPoints: ['cassandra-node1'],
  localDataCenter: 'datacenter1',
  keyspace: 'sampledata',
  authProvider: new PlainTextAuthProvider('cassandra', 'cassandra')
});

app.get("/", (req, res) => {
  res.send("ola api");
});
let query = `SELECT * FROM months`

app.get("/create", async (req, res) => {
    await client.execute(query, (error, result) => {
      if (error != undefined) {
        console.log(error);
      }else {
        console.log(result);
        res.json(result.rows);
      }

    })

});


/* PORTS */

app.listen(port,host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});