const express = require("express");
const { insertUser, updateUserState, searchUser } = require("../db/mongo");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const serializeUser = require("../lib/serializeUser");
const useLocalStrategy = require("../lib/useLocalStrategy");
const validateData = require("../lib/validateData");
const saltRounds = 10;
const Mailjet = require('node-mailjet');
require('dotenv').config()

/* ---------------------

    EJECUCIÓN DE LIBRERIAS

  --------------------- */

useLocalStrategy();

serializeUser();

/* ---------------------

    RUTAS PUBLICAS

  --------------------- */

// MOSTRAR EL FORMULARIO PARA INICIAR SESION
router.get("/", (req, res) => {
  res.render("login", { title: "Iniciar Sesión | STECH" });
});

// MOSTRAR EL FORMULARIO PARA REGISTRARSE
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Registrarse | STECH" });
});

// VISTA DE USUARIO OLVIDÓ CONTRASEÑA (FORMULARIO)
router.get('/forgotPass', (req, res, next)=>{
  res.render('forgotPass', { title: "Contraseña Olvidada | STECH" })
});

router.get("/:id", (req, res, next)=>{
  updateUserState(req.params.id)
  .then(()=>{
    res.redirect('/login?confirmed=1')
  })
  .catch(()=>{
    console.log('Error al activar cuenta')
  })
})

/* ---------------------

    RUTAS POST

  --------------------- */

// REGISTRAR A UN USUARIO
router.post("/signup", (req, res) => {
  const validatedData = validateData(req.body);

  // REDIRECCIONAR EN CASO DE QUE EL FORMATO DE LA DATA SEA INVALIDA
  if (validatedData.error) {
    res.redirect("/login/signup?errSU=1");
    return;
  }

  // REDIRECCIONAR EN CASO DE QUE LAS CONTRASEÑA DE CONFIRMACION NO CONCUERDE
  if (validatedData.value.contrasena !== validatedData.value.confirmacion) {
    res.redirect("/login/signup?errSU=2");
    return;
  }

  // ENCRIPTAR LA CONTRASEÑA Y GUARDARLA EN LA BASE DE DATOS
  bcrypt.hash(validatedData.value.contrasena, saltRounds, async (err, hash) => {
    const userData = {
      nombres: validatedData.value.nombres,
      apellidos: validatedData.value.apellidos,
      email: validatedData.value.email,
      contrasena: hash,
      estado: "pendiente"
    };

    await insertUser(userData)
      .then((data) => {
        const mailjet = Mailjet.apiConnect(
          process.env.MJ_APIKEY_PUBLIC,
          process.env.MJ_APIKEY_PRIVATE,
        )
        const request = mailjet
          .post('send', { version: 'v3.1' })
          .request({
            Messages: [
              {
                From: {
                  Email: process.env.MJ_SENDER_USER,
                  Name: "STECH Global"
                },
                To: [
                  {
                    Email: `${data.email}`,
                    Name: `${data.nombres} ${data.apellidos}`
                  }
                ],
                TemplateID: 4064929,
                TemplateLanguage: true,
                Subject: "Account Confirmation",
                Variables: {
                  "user_name": data.nombres,
                  "user_id": data._id
                }
              }
            ]
          })

        request
          .then((result) => {
            console.log(result.body)
          })
          .catch((err) => {
            console.log(err.statusCode)
          })
          .finally(() => {
            res.redirect('/login?confirm=1')
          })
      })
      .catch(() => {
        console.log('Error al encontrar nuevo usuario')
        res.redirect("/login/signup?errSU=3");
      })
  });
});

// INICIAR SESION
router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login?err=1" }),
  function (req, res) {
    res.redirect("/?good=1");
  }
);

// MANDAR CORREO A USUARIO QUE PIDE NUEVA CONTRASEÑA
router.post('/forgotPass', async (req, res, next)=>{
  await searchUser(req.body.email)
  .then((data) => {
    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE,
    )
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MJ_SENDER_USER,
              Name: "STECH Global"
            },
            To: [
              {
                Email: `${data.email}`,
                Name: `${data.nombres} ${data.apellidos}`
              }
            ],
            TemplateID: 4064855,
            TemplateLanguage: true,
            Subject: "Change Password",
            Variables: {
              "user_name": data.nombres,
              "user_id": data._id
            }
          }
        ]
      })

    request
      .then((result) => {
        console.log(result.body)
      })
      .catch((err) => {
        console.log(err.statusCode)
      })

      res.redirect('/?getNewP=1')
  })
  .catch(() => {
    console.log('Error al enviar el correo de cambio de contraseña')
    res.redirect("/login/signup?errSU=5");
  })
})

module.exports = router;