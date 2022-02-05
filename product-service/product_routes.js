const express = require('express');
const Product = require('./Product');
const router = express.Router();
const isAuthenticated = require('../auth_middleware');

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.post('/product/create', isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;

  const new_product = new Product({ name, description, price });
  return res.send('eh');
});

// router.post('/auth/register', async (req, res) => {
//   const { email, password, name } = req.body;

//   try {
//     const emailTaken = await User.findOne({ email });
//     if (emailTaken) {
//       return res.json({ message: 'Mail Already Taken!' });
//     } else {
//       const hash = await bcrypt.hash(password, 10);
//       const new_user = new User({
//         name: name,
//         email: email,
//         password: hash,
//       });
//       new_user.save();
//       return res.json({ message: 'User Successfully Registered!' });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
