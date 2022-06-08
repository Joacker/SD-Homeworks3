const { client } = require('../config/database')

const usuarios = async (req,res) => {
    //res.header("Access-Control-Allow-Origin","*");
    const response = await poolPDF.query(`select * from encontrados;`);
    console.log("Getting all clientes");
    //console.log(response.rows[0].ip);
    res.json(response.rows);
};

module.exports = {
    usuarios,
};