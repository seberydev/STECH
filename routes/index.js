const express = require("express");
const router = express.Router();

/* GET - PÁGINA DE INICIO */
router.get("/", function (req, res, next) {
  res.render("index", { title: "STECH" });
});

module.exports = router;
