const { MongoClient } = require("mongodb");

const dbName = "stech";
const usersCollectionName = "users";
const url = `mongodb+srv://sebastian:n56CLuhZehkglQI1@cluster0.bvuws.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(url);

const connectToMongo = async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(usersCollectionName);

  console.log("Connected To Mongo");

  return {
    collection,
    db,
  };
};

const insertUser = async (user) => {
  const { collection } = await connectToMongo();

  const res = await collection.findOne({
    email: user.email,
  });

  if (res) {
    client.close();

    return {
      inserted: false,
    };
  }

  await collection.insertOne(user);

  client.close();

  return {
    inserted: true,
  };
};

module.exports = {
  client,
  url,
  dbName,
  usersCollectionName,
  connectToMongo,
  insertUser,
};
