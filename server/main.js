"use strict";
/* IMPORTS */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');
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

///////////////////////////////////////////////////////////////

var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;

const client = new cassandra.Client({
  contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
  localDataCenter: 'datacenter1',
  keyspace: 'medic_1',
  authProvider: new PlainTextAuthProvider('cassandra', 'cassandra')
});

const client2 = new cassandra.Client({
  contactPoints: ['cassandra-node1','cassandra-node2','cassandra-node3'],
  localDataCenter: 'datacenter1',
  keyspace: 'medic_2',
  authProvider: new PlainTextAuthProvider('cassandra', 'cassandra')
});

app.get("/", (req, res) => {
  res.send("ola api");
});

app.get('/getRecipes', async(req, res) => {
  
  const query = 'SELECT * FROM recetas';
  const result = await client2.execute(query);
  res.json(result.rows);
}
);

app.post('/edit',async (req,res)=>{
  const query = 'select * from recetas where id = ? ALLOW FILTERING';
  const {id, comentario, farmacos,doctor} = req.body;
  client2.execute(query, [id], { prepare: true }).then(result => {
    if(result.rows[0] != undefined){
    // Existe el registro, a Updatear
    console.log(result.rows);
    const query2 = `update recetas 
                        set 
                            comentario = ?, 
                            farmacos = ?,
                            doctor = ? 
                      where 
                            id=?;`;
      client2.execute(query2,[req.body.comentario,req.body.farmacos,req.body.doctor,req.body.id]).then(result2 => {
        console.log(result2)
        res.json("Recipe updated");
    }).catch(err => {console.log(err);});
  }else{
    res.json("Recipe not found");
  }
  }).catch(err => {
    console.log(err);})();
});

app.post('/delete',async (req,res)=>{
  const query2 = 'select * from recetas where id = ? ALLOW FILTERING';
  client2.execute(query2, [req.body.id], { prepare: true }).then(result => {
    if(result.rows[0] != undefined){
    // Existe el registro, a Deletear
    const query = `delete from recetas where id=?;`;
    console.log(result.rows);
    client2.execute(query,[req.body.id]).then(result2 => {
      console.log(result2)
      res.json("Recipe deleted with id: "+req.body.id);
    }).catch(err => {console.log(err);});
    }else{
      res.json("Recipe not found");
    }
  }).catch(err => {
    console.log(err);}
  )();
});

app.post('/create', (req, res) => {
  (async () => {
    const query = 'SELECT * FROM pacientes WHERE rut=? ALLOW FILTERING';
    const query2 = `INSERT INTO 
                               pacientes (id, 
                                          nombre,
                                          apellido,
                                          rut,
                                          email,
                                          fecha_nacimiento) 
                                          VALUES(?,?,?,?,?,?);`;
    const query3 = `INSERT INTO 
                               recetas (id, 
                                        id_paciente,
                                        comentario,
                                        farmacos,
                                        doctor) 
                                        VALUES(?,?,?,?,?);`;
    const receta = req.body;
    var gen_id_1 = uuidv4();
    var gen_id_2 = uuidv4();
    console.log("Receta: ",receta)
    console.log("ID gen para Paciente: ",gen_id_1)
    console.log("ID gen para Receta: ",gen_id_2)

    await client.execute(query,[receta.rut]).then(result => {
      console.log('Result ' + result.rows[0]);

      if(result.rows[0] != undefined){
        console.log("existe el paciente")
        client2.execute(query3,[gen_id_2,result.rows[0].id,receta.comentario,receta.farmacos,receta.doctor]).then(result2 => {
          console.log('Result ' + result2);
          res.json({'ID_Receta': gen_id_2})
        }).catch((err) => {console.log('ERROR:', err);});

      }else{
        console.log("No existe el paciente")
        client.execute(query2,[gen_id_1,receta.nombre,receta.apellido,receta.rut,receta.email,receta.fecha_nacimiento]).then(result => {
          console.log('Result ' + result);
          client2.execute(query3,[gen_id_2,gen_id_1,receta.comentario,receta.farmacos,receta.doctor]).then(result2 => {
            console.log('Result ' + result2);
            res.json({'ID_Receta': gen_id_2})
          }).catch((err) => {console.log('ERROR:', err);});
        }).catch((err) => {console.log('ERROR:', err);});
      }
    }).catch((err) => {console.log('ERROR:', err);});
  })();
  
});


/* PORTS */

app.listen(port,host, () => {
  console.log(`API run in: http://localhost:${port}.`);
});