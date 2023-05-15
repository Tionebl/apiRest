const references = require('../../references');
const $name = references.SERVICES.AUTHENTICATION;

module.exports = function ({ mainLog, config, constants, usersService, apiTokensService }) {
  const logW = mainLog($name);
  const jwt = require('jsonwebtoken');
  const moment = require('moment');

  const secret = 'nooliTicSecretStory!102009';
  const apiKey = 'US9m8879X4AS1ob53rjcw0V08c869x0S';

  function extractToken (req) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      // try bearer
      if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
      }
    }
    return token;
  }

  async function Auth (req, res, next) {
    const token = extractToken(req);
    if (token) {
      logW.silly('Auth', 'Check an authentification with token');
      const apiKey = await apiTokensService.GetByToken(token);
      if (apiKey) {
        req.decoded = apiKey;
        req.decoded.role = apiKey.clientId && apiKey.clientId !== '' ? 'user' : 'admin';
        apiTokensService.Update(apiKey._id, { lastUsage: moment().utc() });
        next();
      } else {
        jwt.verify(token, secret, function (err, decoded) {
          if (err) {
            return res.status(400).json({ success: false, message: 'Failed to authenticate' });
          } else {
            req.decoded = decoded.data;
            next();
          }
        });
      }
    } else {
      /* No token provided */
      return res.status(400).send({
        success: false,
        message: 'No token provided.'
      });
    }
  }
  async function IsAuthenticated (req, res) {
    logW.silly('IsAuthenticated', 'Is user logged');
    const token = extractToken(req);

    if (token) {
      jwt.verify(token, secret, async function (err, decoded) {
        const user = await usersService.Get({ _id: decoded.data._id });
        if (user) {
          delete user.password;
          delete user.token;
          decoded.data = user;
          res.status(200).send(decoded);
        } else {
          res.status(400).send(err);
        }
      });
    } else {
      res.status(400).send({ error: 'no token in request' });
    }
  }

  async function LogIn (req, res) {
    try {
      let username;

      if (req.body.username) {
        username = req.body.username;
      } else {
        if (req.body.email) {
          username = req.body.email;
        }
      }
      const password = req.body.password;

      logW.silly('Login', 'User ' + username + ' is login');

      const user = await usersService.GetByUsername(username);
      if (!user) {
        return res.status(400).send({ error: 'Bad username or password' });
      }
      if (!user.role) {
        return res.status(500).send({ error: 'Bad user, no role defined' });
      }
      if (user.role == 'system') {
        return res.status(500).send({ error: 'System account cannot login' });
      }
      const isMatch = await usersService.Validate(user.username, password);
      user.token = ''; // reset the old token
      if (isMatch) {
        delete user.password;
        delete user.token;
        const token = jwt.sign({ data: user }, secret, {
          expiresIn: '1d'
        });
        // Update the user
        user.lastLogin = moment().utc();
        user.token = '';
        user.tokenCreation = moment().utc();
        await usersService
          .Update(user._id, { lastLogin: moment().utc(), token: '', tokenCreation: moment().utc() })
          .then(() => {
            return res.status(200).send({ token });
          })
          .catch((err) => {
            logW.error("Can't save user : " + err.message, 'Login');
            res.status(500).send(new Error("Can't save user info"));
          });
      } else {
        return res.status(401).send({ error: 'Bad username or password' });
      }
    } catch (err) {
      logW.error('Login', err.message);
      return res.status(500).send({ error: err.message });
    }
  }

  async function LogOut (req, res) {
    logW.debug('logOut', 'User has logged out');
    return res.status(200).send();
  }

  async function CreateToken (user) {
    logW.silly('Create a new token for ' + user.email, 'CreateToken');
    return jwt.sign(user, secret, {
      expiresInMinutes: 1440 // expires in 24 hours
    });
  }

  async function GetUser (req, res) {
    const token = extractToken(req);
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, function (err, user) {
        if (err) {
          return reject(err);
        } else {
          return resolve(user);
        }
      });
    });
  }

  return {
    LogIn,
    IsAuthenticated,
    LogOut,
    Auth,
    GetUser
  };
};

module.exports.$name = $name;
module.exports.$dep = ['usersService'];
