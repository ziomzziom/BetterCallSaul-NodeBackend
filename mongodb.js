const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoUrl = 'mongodb://localhost:27017'; 
const dbName = 'bettercallsaul';

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    _db = client.db(dbName);
    console.log(`Connected to MongoDB: ${mongoUrl}/${dbName}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
  }
}

async function getDb() {
  if (!_db) {
    await connectToDatabase();
  }
  return _db;
}

module.exports = { getDb };