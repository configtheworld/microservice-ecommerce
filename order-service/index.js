const express = require('express');
const app = express();
const PORT = process.env.AUTH_PORT || 3003;
const mongoose = require('mongoose');
const amqp = require('amqplib');
const order_routes = require('./order_routes');
let channel, connection;

mongoose
  .connect('mongodb://localhost/order-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB configed');
  })
  .catch((err) => {
    console.log('ERROR:', err.message);
  });

async function queue_connect() {
  const amqp_server = 'amqp://localhost:5672';
  connection = await amqp.connect(amqp_server);
  channel = await connection.createChannel();
  await channel.assertQueue('ORDER');
}
queue_connect().then(() => {
  channel.consume('ORDER', (data) => {
    const { products, userEmail } = JSON.parse(data.content);
    console.log('Consuming ORDER queue');
    console.log(products);
  });
});

app.use(express.json());

app.use(order_routes);

app.listen(PORT, () => {
  console.log('order service is on live');
});
