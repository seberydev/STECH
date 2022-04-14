const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ObjectId } = require("mongodb");
const { client, dbName, usersCollectionName } = require("../db/mongo");

passport.deserializeUser(async function (id, done) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(usersCollectionName);
  collection.findOne({ _id: ObjectId(id) }, function (err, user) {
    done(err, user);
  });
});

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/assistence", (req, res, next) => {
  res.render("assistence");
});

router.get("/usage_terms", (req, res, next) => {
  res.render("usage_terms");
});

router.get("/onlineSupport", isAuth, (req, res, next) => {
  res.render("onlineSupport");
});

router.get("/productos", (req, res, next) => {
  res.render("productos");
});

module.exports = router;
