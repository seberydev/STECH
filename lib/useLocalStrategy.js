const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const { client, dbName, usersCollectionName } = require("../db/mongo");

const useLocalStrategy = () => {
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

        // IN CASE THE USER ISN'T FOUND OR DOESN'T EXIST
        if (!result) {
          client.close();
          return done(null, false);
        }

        client.close();

        const match = await bcrypt.compare(password, result.contrasena);

        // CHECK IF THE PASSWORD PLACED BY THE USER IN THE FORM IS THE SAME AS THE ONE IN THE DB
        if (!match || result.estado && result.estado !== 'activo') {
          return done(null, false);
        }

        return done(null, result);
      }
    )
  );
};

module.exports = useLocalStrategy;
