const { MongoClient, ObjectID } = require("mongodb");
var ObjectId = require('mongodb').ObjectId

const dbName = "stech";
const usersCollectionName = "users";
const url = process.env.MONGODB_URL || "mongodb://localhost:27017";

const client = new MongoClient(url);

const connectToMongo = async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(usersCollectionName);

  console.log("Connected To Mongo");

  return {
    collection,
    db
  };
};

const insertUser = async (user) => {
  const { collection } = await connectToMongo();

  const res = await collection.findOne({
    email: user.email
  });

  // EN CASO DE QUE EL CORREO YA EXISTA, MANDAR ERROR
  if (res) {
    client.close();
    throw false
  }

  await collection.insertOne(user);

  const res2 = await collection.findOne({
    email: user.email
  });

  client.close();

  return res2
};

const updateUserState = async (id) =>{
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(usersCollectionName);

  let response = await collection.findOneAndUpdate({_id:ObjectId(id)}, {$set:{estado:"activo"}}, {new:true})

  if(!response){
    throw false
  }
  return response
}

const updateUserPass = async (id, contraNueva) =>{
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(usersCollectionName);

  let response = await collection.findOneAndUpdate({_id:ObjectId(id)}, {$set:{contrasena:contraNueva}}, {new:true})

  if(!response){
    throw false
  }
  return response
}

const insertPayment = async (payment) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("payments");

  await collection.insertOne(payment);

  client.close();
};

const searchUser = async (email) =>{
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");

  let response = await collection.findOne({email:email})

  console.log(response)
  console.log(email)

  if(!response){
    throw false
  }
  return response
}

const searchUser2 = async (id) =>{
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");

  let response = await collection.findOne({_id:ObjectId(id)})

  if(!response){
    throw false
  }
  return response
}

const deleteAccount = async (user) => {
  const { collection } = await connectToMongo();
  await collection.updateOne(
    {
      email: user.email,
    },
    {
      $set: {
        estado: "inactivo",
      },
    }
  );
};

module.exports = {
  client,
  url,
  dbName,
  usersCollectionName,
  connectToMongo,
  insertUser,
  insertPayment,
  updateUserState,
  searchUser,
  searchUser2,
  updateUserPass,
  deleteAccount
};
