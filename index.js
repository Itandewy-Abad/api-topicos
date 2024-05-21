// console.log("Hola desde el archivo index");

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express(); // Creamos la instancia del servidor express.

//middlewares: intérpretes que ayudan a conectar una tecnología con otra
app.use(express.json())
app.use(cors()) // Si quisiéramos limitar quién puede acceder a la api, se especifica la ruta dentro del paréntesis del cors.

// Iniciamos el servidor:
const PORT = 3000

app.listen(PORT, ()=>{ // Para saber en qué puerto está escuchando. Listen recibe dos parámetros: el puerto donde está escuchando y lo que va a escuchar.
    console.log("Servidor corriendo en http://localhost:" + PORT)
})
// Hasta aquí ya tenemos la parte de express

// Conexión con MYSQL
const connection = mysql.createConnection({
    host:"localhost", // En vez de localhost también podemos colocar una IP
    user:"root",
    pass:"", // Si no tiene contraseña de deja vacío
    port:3306, // El puerto en el que se está ejecutando mysql ya sea con Laragon o Xampp
    database:"topicos"
})

// Hay que empezar a manejar errores para conocer el estado del correcto o incorrecto funcionamiento.
connection.connect((err)=>{
    if(err){ 
        console.error(err.message || "No se pudo conectar a la base de datos.") // Normalmente los errores que se mandan en un servicio web traen el message pero si no existe tal mensaje podemos indicarle uno manualmente.
    }else{
        console.log("Conectado a la base de datos.")
    }
})

app.get("/",(req,res)=>{
    connection.query("SELECT * FROM usuarios",(error,results)=>{
        if(error) res.status(500).json({message: error.message || "No se pueden obtener datos en este momento para la tabla usuarios."})
        else res.status(200).json(results)
    })
})

app.post("/",(req,res)=>{
    const {nombre} = req.body
    connection.query('INSERT INTO usuarios VALUES (DEFAULT, "' + nombre + '")',(error,results)=>{
        if (error) res.status(500).json({message:error.message || "No se pudo insertar dato en este momento."})
        else res.json(results)
    })
})

