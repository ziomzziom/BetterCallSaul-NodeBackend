# BetterCallSaul-NodeBackend
 
server.js: This is the main entry point of your Node.js application. It sets up the Express.js app, connects to the MongoDB database using Mongoose, and defines API endpoints for login and registration.
mongodb.js: This file contains a function to connect to the MongoDB database using the MongoClient from the mongodb package.
routes/users.js: This file defines a route for creating a new user.
models/User.js: This file defines the Mongoose model for the User collection in the MongoDB database. It includes a pre-save hook to hash the password using bcrypt.
controllers/user.js: This file contains a function to create a new user.
controllers/login.js: This file contains a function to handle login authentication.
