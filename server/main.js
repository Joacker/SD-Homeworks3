"use strict";
/* IMPORTS */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cassandra = require('cassandra-driver');

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
//let authProvider = new cassandra.auth.PlainTextAuthProvider('Username', 'Password');
///////////////////////////////////////////////////////////////

const client = new cassandra.Client({
  contactPoints: ['cassandra-cluster:9042', 'cassandra-cluster:9142', 'cassandra-cluster:9242'],
  localDataCenter: 'datacenter1',
  keyspace: 'test',
  authProvider: new PlainTextAuthProvider('cassandra', 'cassandra')
});

app.get("/", (req, res) => {
  res.send("ola api");
});
let query = `SELECT * FROM months`
app.post("/create", async (req, res) => {
  const { nombre, apellido, rut, email, fecha_nacimiento, comentario, farmacos, doctor } = req.body
  let parameters = [rut];
    await client.execute(query,parameters, (error, result) => {
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