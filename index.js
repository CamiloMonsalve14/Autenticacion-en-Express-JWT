
const express = require("express");
const app = express();
const port = 4000
const jwt = require("jsonwebtoken");
require ("dotenv").config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get ("/", (req, res) => {
    res.send("Hola mundo")
});

app.get ("/api", validarToken, (req, res) => {
    res.json ({
        username: req.user,
    datos: [
        {
            id: 123,
            nombre: "camilo",
            telefono: 1234567890
        },
        {
            id: 321,
            nombre: "jose",
            telefono: 9874563210
        }
    ]
    });
});

app.get ("/login", (req, res) => {
    res.send (`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
    </head>
    <body>
        <form method="POST" action="/auth">
        Nombre de usuario: <input type="text" name="text"><br/>
        Contraseña: <input type="password" name="password"><br/>
        <input type="submit" value="Iniciar Sesión" />
        </form>

    </body>
    </html>`)
})

app.post ("/auth", (req, res) => {
    const {username, password} = req.body;

    const user = {username: username};

    const accessToken= generateAccesToken(user);

    res.header("autorization", accessToken).json({
        message: "Usuario Auntenticado",
        token: accessToken
    })
});

function generateAccesToken(user){
    return jwt.sign(user, process.env.SECRET, {expiresIn: "5m"});
}

function validarToken (req, res, next){
    const accessToken = req.headers ["autorization"] || req.query.accesstoken;
    if(!accessToken) res.send("Acceso Denegado")

    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
    if (err){
        res.send("Acceso denegado, Token expirado o incorrecto");
    }else{
        req.user = user;
        next();
    }

    } )
}

app.listen(port, () => {
    console.log (`servidor corriendo en el puerto ${port}`)
});
