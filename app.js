const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

// VIEW ENGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// ERROR 404
app.use(function (req, res, next) {
  next(createError(404));
});

// MANEJADOR DE ERRORES
app.use(function (err, req, res, next) {
  // MOSTRAR ERROR EN DESARROLLO
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // RENDERIZAR ERROR
  res.status(err.status || 500);
  res.render("error", {
    message: `Error ${err.status || 500} - Página No Encontrada`,
  });
});

module.exports = app;
