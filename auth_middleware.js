const jwt = require('jsonwebtoken');

module.exports = async function isAuthenticated(req, res, next) {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const user = await jwt.verify(token, '*ExperimentalSecretCode*');
    req.user = user;
    next();
  } catch (error) {
    return res.json({ message: error });
  }
};
