const express = require('express');
const app = express();

const authRouter = require('./auth/auth');
const offersRouter = require('./offers/offers');

app.use('/api/auth', authRouter);
app.use('/api/offers', offersRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));