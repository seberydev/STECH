const express = require("express");
const { insertUser } = require("../db/mongo");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const serializeUser = require("../lib/serializeUser");
const useLocalStrategy = require("../lib/useLocalStrategy");
const validateData = require("../lib/validateData");
const saltRounds = 10;

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
    const data = {
      nombres: validatedData.value.nombres,
      apellidos: validatedData.value.apellidos,
      email: validatedData.value.email,
      contrasena: hash,
    };

    const result = await insertUser(data);

    // REDIRECCIONAR EN CASO DE QUE UN CORREO SIMILAR YA SE REGISTRO
    if (!result.inserted) {
      res.redirect("/login/signup?errSU=3");
      return;
    }

    res.redirect("/login");
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

module.exports = router;
