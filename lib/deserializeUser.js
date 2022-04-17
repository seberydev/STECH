const passport = require("passport");
const { ObjectId } = require("mongodb");
const { client, dbName, usersCollectionName } = require("../db/mongo");

const deserializeUser = () => {
  passport.deserializeUser(async function (id, done) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(usersCollectionName);
    collection.findOne({ _id: ObjectId(id) }, function (err, user) {
      done(err, user);
    });
  });
};

module.exports = deserializeUser;
