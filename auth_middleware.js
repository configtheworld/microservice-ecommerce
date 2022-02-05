const jwt = require('jsonwebtoken');

/**Authentication Middleware
 * @desc checking jwt token make sure its valid and passes decoded the user info
 * @next req.user
 */
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
