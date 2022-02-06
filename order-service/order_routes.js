const express = require('express');
const Order = require('./Order');
const router = express.Router();
const isAuthenticated = require('../auth_middleware');

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

module.exports = router;
