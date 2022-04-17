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
};

module.exports = useLocalStrategy;
