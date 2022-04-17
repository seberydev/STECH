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
router.get("/", (req, res, next) => {
  res.render("login", { title: "Iniciar Sesión | STECH" });
});

// MOSTRAR EL FORMULARIO PARA REGISTRARSE
router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Registrarse | STECH" });
});

/* ---------------------

    RUTAS POST PUBLICAS

  --------------------- */

// REGISTRAR A UN USUARIO
router.post("/signup", (req, res, next) => {
  const validatedData = validateData(req.body);

  // REDIRECCIONAR EN CASO DE QUE EL FORMATO DE LA DATA SEA INVALIDA
  if (validatedData.error) {
    res.redirect("/login/signup");
    return;
  }

  // REDIRECCIONAR EN CASO DE QUE LAS CONTRASEÑA DE CONFIRMACION NO CONCUERDE
  if (validatedData.value.contrasena !== validatedData.value.confirmacion) {
    res.redirect("/login/signup");
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
      res.redirect("/login/signup");
      return;
    }

    res.redirect("/login");
  });
});

// INICIAR SESION
router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

module.exports = router;
