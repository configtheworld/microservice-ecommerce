const express = require('express');
const Product = require('./Product');
const router = express.Router();
const isAuthenticated = require('../auth_middleware');
const getChannel = require('./index');
/**Ping
 * @desc test server is running
 * @exp res : pong
 */

router.get('/ping', (req, res) => {
  res.send('pong');
});

/**Product Buy with Array
 * @body product_barcodes:[]
 * @desc buy operation
 */

router.post('/product/create', isAuthenticated, async (req, res) => {
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

router.post('/product/buy', isAuthenticated, async (req, res) => {
  try {
    const { product_barcodes } = req.body;

    const products = await Product.find({ _id: { $in: product_barcodes } });

    // TODO: channel.sentToQueue is not a function
    const channel = getChannel;
    channel.sentToQueue(
      'ORDER',
      Buffer.from(JSON.stringify({ products, userEmail: req.user.email }))
    );

    return res.json({ message: products });
  } catch (error) {
    console.log(error);
    return res.json({ message: 'Product could not bought' });
  }
});

module.exports = router;
