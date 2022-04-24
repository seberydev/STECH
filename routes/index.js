const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");
const isAuth = require("../lib/isAuth");
const deserializeUser = require("../lib/deserializeUser");
const { insertPayment } = require("../db/mongo");
const setAccessToken = require("../lib/setAccessToken");

/* ---------------------

    EJECUCIÓN DE LIBRERIAS

  --------------------- */

setAccessToken();
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
router.get("/contacto", (req, res) => {
  res.render("contacto", { title: "Contacto | STECH" });
});

// SE MUESTRAN LOS PRODUCTOS
router.get("/productos", (req, res) => {
  res.render("productos", { title: "Productos | STECH" });
});

// SE MUESTRAN LOS PRODUCTOS
router.get("/manual-de-usuario", (req, res) => {
  res.render("manual_usuario", { title: "Manual de usuario | STECH" });
});

// SE MUESTRAN LOS PRODUCTOS
router.get("/manual-tecnico", (req, res) => {
  res.render("manual_tecnico", { title: "Manual Técnico | STECH" });
});

/* ---------------------

    RUTAS PRIVADAS

  --------------------- */

// SE MUESTRA EL CHAT
router.get("/soporte", isAuth, (req, res) => {
  res.render("soporte", {
    title: "Soporte | STECH",
    soporte: req.user.soporte ? req.user.soporte : "",
    nombre: req.user.nombres.split(" ")[0],
  });
});

// SE MUESTRAN LOS MENSAJES DEL CHAT (SOLO PARA EL ADMIN)
router.get("/mensajes", isAuth, (req, res) => {
  if (!req.user.soporte) res.redirect("/soporte");

  res.render("mensajes", { title: "Mensajes | STECH" });
});

// SE MUESTRA EL CARRITO DEL USUARIO
router.get("/carrito", isAuth, async (req, res) => {
  res.render("user_car", {
    title: "Carrito | STECH",
    MP_PUBLIC_KEY:
      process.env.MP_PUBLIC_KEY || "TEST-564e7876-d0d0-41fe-ae71-963f0885db61",
  });
});

// SE CIERRA LAS SESION
router.get("/logout", isAuth, (req, res) => {
  req.logout();
  res.redirect("/login");
});

// SE MUESTRA EL PERFIL DEL USUARIO
router.get("/perfil", isAuth, (req, res, next) => {
  let nombres = "test";
  let apellidos = "test";
  let soporte = null;

  if (req.user) {
    nombres = req.user.nombres;
    apellidos = req.user.apellidos;
    soporte = req.user.soporte;
  }

  res.render("user_profile", {
    title: "Perfil | STECH",
    nombres,
    apellidos,
    soporte,
  });
});

/* ---------------------

    RUTAS POST

  --------------------- */

router.post("/process_payment", (req, res) => {
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

    await insertPayment({
      result,
      data: req.body,
    });

    res.status(200).json({ result });
  } else if (req.body.type == "test") {
    res.status(200).json({ ok: true });
  } else {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
