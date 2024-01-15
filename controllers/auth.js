const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (request, res = response) => {
    const { name, email, password } = request.body;
    try {

        // Verificar si el usuario introducido ya existe.
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un usuario con ese correo electrónico."
            });
        }

        //Creación de usuario.
        usuario = new Usuario(request.body);

        // Encriptar contraseña.
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();

        //Generar JWT.
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
            msg: "Usuario creado con éxito."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error; hable con el administrador del sistema."
        })
    }
};

const loginUsuario = async (request, res = response) => {
    const { email, password } = request.body;

    try {
        // Verificar si el usuario introducido ya existe.
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "No existe ningún usuario con ese correo electrónico."
            });
        }

        // Confirmar la contraseña.
        const passwordValido = bcrypt.compareSync(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({
                ok: false,
                msg: "Contraseña incorrecta."
            });
        }

        //Generar JWT.
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error; hable con el administrador del sistema."
        });
    }
};

const revalidarToken = async (request, res = response) => {

    const { uid, name } = request;

    // Generar un nuevo JWT.
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}