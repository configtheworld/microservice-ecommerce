const express = require('express');
const app = express();
const PORT = process.env.AUTH_PORT || 3001;
const mongoose = require('mongoose');
const user_routes = require('./user_routes');

mongoose
  .connect('mongodb://localhost/auth-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB configed');
  })
  .catch((err) => {
    console.log('ERROR:', err.message);
  });

app.use(express.json());

app.use(user_routes);

app.listen(PORT, () => {
  console.log('auth service is on live');
});
