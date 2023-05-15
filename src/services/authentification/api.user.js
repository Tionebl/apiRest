const $apiName = 'users';

module.exports = function (log, bootstrap) {
  const service = bootstrap.usersService;
  const authenticationsService = bootstrap.authenticationsService;
  const defaultSorting = { username: 1 };

  const apiCommon = require('../api.common')(log, service, {
    defaultSorting,
    forceClientId: false
  });

  async function setPassword (req, res, next) {
    try {
      const { username, password } = req.body;
      if (req.decoded.username !== username) {
        req.response = {
          status: 401,
          body: { error: 'No autorized' }
        };
      }
      const user = await bootstrap.usersService.GetByUsername(username);
      if (!user) {
        req.response = {
          status: 400,
          body: { error: 'User not found : ' + username }
        };
      } else {
        const result = await bootstrap.usersService.ChangePassword(
          username,
          password
        );
        req.response = {
          status: 204,
          body: {}
        };
      }
    } catch (err) {
      log.error('SetPassword', err.message);
      req.response = {
        status: 500,
        body: { error: err.message }
      };
    }
    next();
  }

  async function getResponseHandler (req, res) {
    const body = req.response.body;
    if (body) {
      delete body.password;
      delete body.token;
    }

    return res.status(req.response.status).send(body);
  }

  async function getAllResponseHandler (req, res) {
    let body = req.response.body;
    if (body && body.length > 0) {
      body = body.map((element) => {
        delete element.password;
        delete element.token;
        return element;
      });
    }

    return res.status(req.response.status).send(body);
  }

  async function AddClientUser (user, loggedUser) {
    if (!user.clientId && user.clientId === '') {
      throw new Error('No client defined');
    }
    const clientService = bootstrap.clientsService;
    const client = await clientService.GetById(user.clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    user.companyId = client.companyId;
    if (loggedUser.role !== 'sa' && user.companyId !== loggedUser.companyId) {
      throw new Error('Not authorized to add a user to another company');
    }
    return service.Add(user);
  }

  async function AddAdminUser (user, loggedUser) {
    if (loggedUser.role !== 'sa') {
      if (!loggedUser.companyId || loggedUser.companyId === '') {
        throw new Error('No companyId');
      }
      user.companyId = loggedUser.companyId;
    } else loggedUser.companyId = '';
    return service.Add(user);
  }

  async function Add (req, res, next) {
    try {
      const newUser = req.body;
      let result;
      if (newUser.role === 'user') {
        result = await AddClientUser(newUser, req.decoded);
      }
      if (newUser.role === 'admin') {
        result = await AddAdminUser(newUser, req.decoded);
      }
      if (newUser.role === 'sa') {
        if (req.decoded.role !== 'sa') {
          throw new Error('Only Super Admin can add Super Admin');
        } else result = await AddAdminUser(newUser, req.decoded);
      }

      req.response = {
        status: 200,
        body: result
      };
      next();
    } catch (err) {
      log.error('Add', err.message, {
        username: req.decoded.username,
        client: req.body
      });
      return res.status(500).send({ error: err.message });
    }
  }

  async function getByUsername (req, res, next) {
    try {
      const username = req.params.username;
      if (req.decoded.role === 'user' && username != req.decoded.username) {
        return res
          .status(401)
          .send({ error: 'No authorized to access the ressource' });
      }
      if (!username || username === '') {
        return res.status(400).send({ error: 'No username is request' });
      }
      const user = await service.GetByUsername(username);

      if (
        req.decoded.role === 'admin' &&
        req.decoded.companyId != user.companyId
      ) {
        return res
          .status(401)
          .send({ error: 'No authorized to access the ressource' });
      }
      req.response = {
        status: 200,
        body: user
      };
      next();
    } catch (err) {
      log.error('Add', err.message, { username });
      return res.status(500).send({ error: err.message });
    }
  }

  async function getById (req, res, next) {
    try {
      const user = await service.GetById(req.params.id);
      req.response = {
        status: 200,
        body: user
      };
      next();
    } catch (err) {
      log.error('GetById', err.message);
      return res.status(500).send({ error: err.message });
    }
  }

  async function update (req, res) {
    try {
      const id = req.params.id;
      const body = req.body;
      if (body.password) delete body.password;
      const result = await service.UpdateOne({ _id: id }, body);
      return res.status(204).send();
    } catch (err) {
      log.error('Update', err.message);
      res.status(500).send({ error: err.message });
    }
  }

  async function getAll (req, res) {
    try {
      const { page, limit, sort = { username: 1 } } = req.query;
      const user = req.decoded;
      let query = {};
      let result = null;
      if (user.role === 'user') query = { username: user.username };
      if (user.role === 'admin') query = { companyId: user.companyId };
      if (page)
        {result = await service.Paginate(
          query,
          parseInt(page),
          parseInt(limit),
          sort
        );}
      else result = await service.GetAll(query, sort);
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }

  const router = require('express').Router();
  router.get(
    `/${$apiName}/username/:username`,
    getByUsername,
    getResponseHandler
  );
  router.get(
    `/${$apiName}/:id`,
    getById,
    getResponseHandler
  );
  router.get(`/${$apiName}/`, getAll);
  router.post(
    `/${$apiName}/`,
    Add,
    getResponseHandler
  );
  router.delete(
    `/${$apiName}/:id`,
    apiCommon.RequestHandler,
    apiCommon.ResponseHandler
  );
  router.put(
    `/${$apiName}/password`,
    setPassword,
    apiCommon.ResponseHandler
  );
  router.put(
    `/${$apiName}/:id`,
    update,
    apiCommon.ResponseHandler
  );
  return router;
};

module.exports.$apiName = $apiName;


