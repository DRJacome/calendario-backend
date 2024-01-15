/* 
* npm run dev
* INSTALAR:
* npm express
* npm nodemon -g
* npm i dotenv
* npm i mongoose
* npm i bcryptjs
* npm install jsonwebtoken
* npm i cors
*/

// Importar servidor Express.
const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

console.log(process.env);

// Crear servidor de Express.
const app = express();

// Base de datos.
dbConnection();

// CORS.
app.use(cors());

// Directorio público.
app.use(express.static('public'));

// Lectura y parseo del body (Postman).
app.use(express.json());

// Rutas.
app.use('/api/auth', require('./routes/auth'));
app.use('/api/eventos', require('./routes/eventos'));

//HACER: CRUD -> eventos

// Escuchar peticiones.
app.listen(process.env.PORT, () => {
    console.log(`Servidor activo en puerto ${process.env.PORT}`);
});

