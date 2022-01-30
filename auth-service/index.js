const express = require('express');
const app = express();

const PORT = process.env.AUTH_PORT || 3001;

app.use(express.json());

app.listen(PORT, () => {
  console.log('auth service is on live');
});
