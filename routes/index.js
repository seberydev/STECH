const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");
const isAuth = require("../lib/isAuth");
const deserializeUser = require("../lib/deserializeUser");

mercadopago.configurations.setAccessToken(
  process.env.MP_ACCESS_TOKEN ||
    "TEST-8962167088219956-041722-a71bb00dff642a17a165c7f3dece5f8b-1107392567"
);

/* ---------------------

    EJECUCIÓN DE LIBRERIAS

  --------------------- */

deserializeUser();

/* ---------------------

    RUTAS PUBLICAS

  --------------------- */

// SE MUESTRA LA PAGINA PRINCIPAL
router.get("/", (req, res) => {
  res.render("index", { title: "Inicio | STECH" });
});

// SE MUESTRAN LOS TERMINOS DE USO
router.get("/terminos-de-uso", (req, res) => {
  res.render("usage_terms", { title: "Términos de uso | STECH" });
});

// SE MUESTRAN LOS DATOS DE CONTACTO
router.get("/contacto", (req, res, next) => {
  res.render("contacto", { title: "Contacto | STECH" });
});

// SE MUESTRAN LOS PRODUCTOS
router.get("/productos", (req, res, next) => {
  res.render("productos", { title: "Productos | STECH" });
});

/* ---------------------

    RUTAS PRIVADAS

  --------------------- */

// SE MUESTRA EL CHAT
router.get("/soporte", isAuth, (req, res, next) => {
  res.render("soporte");
});

// SE MUESTRA EL CARRITO DEL USUARIO
router.get("/carrito", async (req, res, next) => {
  // const response = await mercadopago.payment_methods.listAll();

  res.render("user_car", {
    title: "Carrito | STECH",
    MP_PUBLIC_KEY:
      process.env.MP_PUBLIC_KEY || "TEST-4f670c16-0042-400d-bc55-785c4ae3a907",
  });
});

// SE MUESTRA EL PERFIL DEL USUARIO
router.get("/perfil", isAuth, (req, res, next) => {
  res.render("user_profile");
});

/****************** */

router.post("/process_payment", (req, res, next) => {
  mercadopago.payment
    .save(req.body)
    .then(function (response) {
      const { status, status_detail, id } = response.body;
      res.status(response.status).json({ status, status_detail, id });
    })
    .catch(function (error) {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
