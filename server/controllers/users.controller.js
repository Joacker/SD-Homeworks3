const { client } = require('../config/database')

const create = async (req,res) => {
    
    const { nombre, apellido, rut, email, fecha_nacimiento, comentario, farmacos, doctor } = req.body
    client.execute(`SELECT * FROM paciente WHERE rut = ${rut}`, (err, result) => {

    })



    res.json(response.rows);
};

module.exports = {
    create,
};