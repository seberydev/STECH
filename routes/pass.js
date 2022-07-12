const express = require("express");
const router = express.Router();
const { updateUserPass, searchUser2 } = require("../db/mongo");
const bcrypt = require("bcrypt");
const validatePass = require("../lib/validatePass");

// Página para cambiar contraseña de usuario específico
router.get("/:id", (req, res, next) => {
    searchUser2(req.params.id)
        .then((data) => {
            res.render('newPass', { user: data.email, id: data._id, title:'Cambio de Contraseña | STECH' })
        })
        .catch(() => {
            console.log('Usuario no existe')
        })
})

// PAR CAMBIAR LA CONTRASEÑA DE UN USUARIO ESPECÍFICO
router.post('/:id', (req, res, next) => {
    let ID = req.params.id
    searchUser2(ID)
        .then(async (data) => {
            // COMPARAR CONTRASEÑA NUEVA CON LA DE CONFIRMACION
            if (req.body.newP != req.body.confP) {
                res.redirect(`/cPass/${ID}?errSU=2`)
            }

            // COMPARAR CONTRASEÑA NUEVA CON LA DE LA DB
            let response = await bcrypt.compare(req.body.newP, data.contrasena)
            if (response) {
                res.redirect(`/cPass/${ID}?errSU=4`)
            }

            // VALIDAR NUEVA CONTRASEÑA
            let x = {
                newP : req.body.newP
            }
            const validatedPass = validatePass(x);

            // REDIRECCIONAR EN CASO DE QUE EL FORMATO DE LA DATA SEA INVALIDA
            if (validatedPass.error) {
                res.redirect(`/cPass/${ID}?errSU=1`);
                return;
            }

            // HASHEAR NUEVA CONTRASEÑA
            var hash = await bcrypt.hash(req.body.newP, 10);

            updateUserPass(data._id, hash)
            res.redirect('/login?newP=1')
        })
        .catch(() => {
            console.log('Error al cambiar su contraseña')
        })
})

module.exports = router;
