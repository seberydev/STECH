const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");
const isAuth = require("../lib/isAuth");
const deserializeUser = require("../lib/deserializeUser");

mercadopago.configurations.setAccessToken(
  process.env.MP_ACCESS_TOKEN ||
    "TEST-4680153902253138-041813-d788ad6b245bdf7ed7b67ec8255f1691-1107392567"
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
  res.render("user_car", {
    title: "Carrito | STECH",
    MP_PUBLIC_KEY:
      process.env.MP_PUBLIC_KEY || "TEST-564e7876-d0d0-41fe-ae71-963f0885db61",
  });
});

// SE MUESTRA EL PERFIL DEL USUARIO
router.get("/perfil", isAuth, (req, res, next) => {
  res.render("user_profile");
});

/****************** */

router.post("/process_payment", (req, res, next) => {
  const data = {
    ...req.body,
    notification_url:
      "https://stech-website.herokuapp.com/notifications?source_news=webhooks",
  };

  mercadopago.payment
    .save(data)
    .then(function (response) {
      const { status, status_detail, id } = response.body;
      res.status(response.status).json({ status, status_detail, id });
    })
    .catch(function (error) {
      res.status(500).json({ error: error });
    });
});

router.post("/notifications", async (req, res) => {
  if (req.body.type == "payment") {
    const result = await mercadopago.payment.findById(req.body.data.id);

    res.status(200).json({ result });
  } else if (req.body.type == "test") {
    res.status(200).json({ ok: true });
  } else {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
