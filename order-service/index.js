const express = require('express');
const app = express();
const PORT = process.env.AUTH_PORT || 3003;
const mongoose = require('mongoose');
const amqp = require('amqplib');
const order_routes = require('./order_routes');
const Order = require('./Order');
let channel, connection;
var order;
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
    console.log('Consuming ORDER queue');
    const { products, userEmail } = JSON.parse(data.content);
    const order = createOrder(products, userEmail);
    // acknowledge the data
    channel.ack(data);
    channel.sendToQueue(
      'PRODUCT',
      Buffer.from(JSON.stringify({ products, userEmail: userEmail }))
    );

    channel.consume('PRODUCT', (data) => {
      console.log('Consuming PRODUCT queue');
      order = JSON.parse(data.content);
      channel.ack(data);
    });
  });
});

function createOrder(products, userEmail) {
  let total = 0;
  for (
    let product_index = 0;
    product_index < products.length;
    product_index++
  ) {
    total += products[product_index].price;
  }
  const new_order = new Order({
    products,
    user: userEmail,
    total_price: total,
  });
}
app.use(express.json());

app.use(order_routes);

app.listen(PORT, () => {
  console.log('order service is on live');
});
