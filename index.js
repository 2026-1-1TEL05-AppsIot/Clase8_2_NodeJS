const {MongoClient} = require("mongodb");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname + "/form.html"))
});


const mongoClient = new MongoClient("mongodb://localhost:27017/?maxPoolSize=20");
const database = mongoClient.db("Clase8");

app.post('/guardar', bodyParser.urlencoded({extended: true}), async (req, res) => {

   let dataToBeSaved = {
       nombre: req.body.nombre,
       apellido: req.body.apellido,
       dni: req.body.dni,
       email: req.body.email,
       edad: Number(req.body.edad)
   };

   try {
    let result = await database.collection("users").insertOne(dataToBeSaved);
    console.log(`Nuevo documento insertado con _id: ${result.insertedId}`);

    res.json({idInsertado: result.insertedId})
} catch (e) {
    console.error(e);
    res.json({error: e});
}
});

app.get("/listar/:nombre?", async (req, res) => {
    try {
        const userName = req.params.nombre;
        let query = {};
        if (userName) {
            query.nombre = { $regex: `^${userName}`, $options: 'i' };
        }
        let cursor = await database
            .collection("users")
            .find(query);
        let allValues = await cursor.toArray();
        console.log(`Consulta : listar ${userName}`);
        res.json(allValues);
    } catch (e) {
        console.error(e);
        res.json({error: e});
    }
});


app.listen(3000,() => {
console.log("Servidor desplegado correctamente");
});