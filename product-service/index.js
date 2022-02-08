const express = require('express');
const app = express();
const PORT = process.env.AUTH_PORT || 3002;
const mongoose = require('mongoose');
const Product = require('./Product');
const amqp = require('amqplib');
const isAuthenticated = require('../auth_middleware');
var order;

var channel, connection;

mongoose
  .connect('mongodb://localhost/product-service', {
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

async function connect() {
  const amqpServer = 'amqp://localhost:5672';
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue('PRODUCT');
}
connect();

/**Ping
 * @desc test server is running
 * @exp res : pong
 */

app.get('/ping', (req, res) => {
  res.send('pong');
});

/**Product Buy with Array
 * @body product_barcodes:[]
 * @desc buy operation
 */

app.post('/product/create', isAuthenticated, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const new_product = new Product({ name, description, price });
    new_product.save();
    return res.send({
      message: 'Product (' + new_product.name + ') successfully created',
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Product could not created' });
  }
});

/**Product Buy with Array
 * @body product_barcodes:[]
 * @desc buy operation
 */

app.post('/product/buy', isAuthenticated, async (req, res) => {
  try {
    const { product_barcodes } = req.body;
    const products = await Product.find({ _id: { $in: product_barcodes } });
    channel.sendToQueue(
      'ORDER',
      Buffer.from(
        JSON.stringify({
          products,
          userEmail: req.user.email,
        })
      )
    );
    channel.consume('PRODUCT', (data) => {
      order = JSON.parse(data.content);
    });
    return res.json({ message: 'order added to queue' });
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Product could not bought' });
  }
});

app.listen(PORT, () => {
  console.log('product service is on live');
});
