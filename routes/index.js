const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");
const isAuth = require("../lib/isAuth");
const deserializeUser = require("../lib/deserializeUser");

mercadopago.configurations.setAccessToken(
  "TEST-6443081575674090-041513-3beeb8dc5adbdbeb488cb53f7b5fb43e-1107392567"
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
router.get("/carrito", (req, res, next) => {
  res.render("user_car", { title: "Carrito | STECH" });
});

// SE MUESTRA EL PERFIL DEL USUARIO
router.get("/perfil", isAuth, (req, res, next) => {
  res.render("user_profile");
});

/****************** */

router.post("/process_payment", (req, res, next) => {
  const { body } = req;
  const { payer } = body;

  const paymentData = {
    transaction_amount: Number(body.transaction_amount),
    token: body.token,
    description: body.description,
    installments: Number(body.installments),
    payment_method_id: body.paymentMethodId,
    issuer_id: body.issuerId,
    payer: {
      email: payer.email,
      identification: {
        type: payer.identification.docType,
        number: payer.identification.docNumber,
      },
    },
  };
  mercadopago.payment
    .save(paymentData)
    .then(function (response) {
      const { response: data } = response;
      res.status(201).json({
        detail: data.status_detail,
        status: data.status,
        id: data.id,
      });

      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      const { errorMessage, errorStatus } = validateError(error);
      res.status(errorStatus).json({ error_message: errorMessage });
    });
});

function validateError(error) {
  let errorMessage = "Unknown error cause";
  let errorStatus = 400;

  // if (error.cause) {
  //   const sdkErrorMessage = error.cause[0].description;
  //   errorMessage = sdkErrorMessage || errorMessage;

  //   const sdkErrorStatus = error.status;
  //   errorStatus = sdkErrorStatus || errorStatus;
  // }

  return { errorMessage, errorStatus };
}

module.exports = router;
