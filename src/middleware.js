const jwt = require('jsonwebtoken');

const { jwtSecret } = require('./config');

module.exports = {
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      req.user = jwt.verify(token, jwtSecret);
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send({ err: 'Invalid Token' });
    }
  },
};
