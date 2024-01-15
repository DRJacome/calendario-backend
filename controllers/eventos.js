const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async (request, res = response) => {
    const eventos = await Evento.find().populate('user', 'name');
    res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async (request, res = response) => {

    // Grabación de evento.
    const evento = new Evento(request.body);

    // Verificar que tenga el evento.
    console.log(request.body);

    try {
        evento.user = request.uid;
        const eventoGuardado = await evento.save();
        res.json({
            ok: true,
            evento: eventoGuardado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error de grabación de datos en la BD. Hable con el admin."
        });
    }
};

const actualizarEvento = async (request, res = response) => {

    // Id del usuario que viene desde la URL.
    const eventoId = request.params.id;
    const uid = request.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento con ese id no existe.'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes los persmisos necesarios para editar este evento.'
            })
        }

        const nuevoEvento = {
            ...request.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });
        res.json({
            ok: true,
            msg: eventoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en la actualización del evento. Hable con el admin.'
        })
    }
}

const eliminarEvento = async (request, res = response) => {

    // Id del usuario que viene desde la URL.
    const eventoId = request.params.id;
    const uid = request.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento con ese id no existe.'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes los permisos necesarios para eliminar este evento.'
            })
        }

        await Evento.findByIdAndDelete(eventoId);
        res.json({
            ok: true,
            msg: "Evento elimindo."
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en la actualización del evento. Hable con el admin.'
        })
    }
}


module.exports = {
    getEventos, crearEvento, actualizarEvento, eliminarEvento
}