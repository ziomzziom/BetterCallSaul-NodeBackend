const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    // ...
  }
});