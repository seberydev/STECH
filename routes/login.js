const express = require("express");
const {
  insertUser,
  client,
  dbName,
  usersCollectionName,
} = require("../db/mongo");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const saltRounds = 10;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "contrasena",
    },
    async function (username, password, done) {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(usersCollectionName);

      const result = await collection.findOne({ email: username });

      if (!result) {
        client.close();
        return done(null, false);
      }

      client.close();

      const match = await bcrypt.compare(password, result.contrasena);

      if (!match) {
        return done(null, false);
      }

      return done(null, result);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

const validateData = (data) => {
  const schema = joi.object({
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .trim()
      .required(),
    nombres: joi.string().min(3).max(100).trim().required(),
    apellidos: joi.string().min(3).max(100).trim().required(),
    contrasena: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .trim()
      .required(),
    confirmacion: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .trim()
      .required(),
  });

  return schema.validate(data);
};

router.get("/", (req, res, next) => {
  res.render("login");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const validatedData = validateData(req.body);

  if (validatedData.error) {
    res.redirect("/login/signup");
    return;
  }

  if (validatedData.value.contrasena !== validatedData.value.confirmacion) {
    res.redirect("/login/signup");
    return;
  }

  bcrypt.hash(validatedData.value.contrasena, saltRounds, async (err, hash) => {
    const data = {
      nombres: validatedData.value.nombres,
      apellidos: validatedData.value.apellidos,
      email: validatedData.value.email,
      contrasena: hash,
    };

    const result = await insertUser(data);

    if (!result.inserted) {
      res.redirect("/login/signup");
      return;
    }

    res.redirect("/login");
  });
});

router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

module.exports = router;
