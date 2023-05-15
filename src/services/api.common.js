module.exports = function (log, service, { forceClientId = true, defaultSorting = {} }) {
    const HttpRequest = require('../entity/entity.httpRequest');
    const HttpResponse = require('../entity/entity.httpResponse');
  
    /**
     * Create a create based on the connected user
     * @param { User } user
     * @returns { Object }
     */
    function GetUserQuery(user) {
      if (!user) {
        throw new Error('Not Authorized');
      }
      if (user.role === 'sa') {
        return {};
      }
      if (user.role === 'admin') {
        if (typeof user.companyId !== 'string') {
          throw new Error('CompanyId is not defined');
        }
        return { companyId: user.companyId };
      }
      if (typeof user.clientId !== 'string') {
        throw new Error('ClientId is not defined');
      }
      if (user.clientId === '') {
        throw new Error('ClientId is not defined');
      }
      return { clientId: user.clientId };
    }
  
    function GetSortingQuery(sort) {
      const direction = sort[0] === '-' ? '-1' : '1';
      const sortQuery = {};
      sortQuery[sort.substring(1)] = direction;
      return sortQuery;
    }
  
    function ParseQueryStringFromRequest(q) {
      const query = {};
      const qParsed = JSON.parse(q);
      const parsedKeys = Object.keys(qParsed);
      for (const i in parsedKeys) {
        if (qParsed[parsedKeys[i]].$regex != null) {
          query[parsedKeys[i]] = new RegExp(qParsed[parsedKeys[i]].$regex, 'i');
        } else {
          query[parsedKeys[i]] = qParsed[parsedKeys[i]];
        }
      }
      return query;
    }
    /**
     * Handle the Get request
     * @param { HttRequest } request
     * @returns  { HttpResponse }
     */
    async function GetHandler(request) {
      try {
        const { id } = request.params;
        const { page, limit, sort, q } = request.query;
        const userQuery = GetUserQuery(request.user);
        const extraQuery = request.extraQuery || {};
        const query = { ...extraQuery, ...userQuery };
  
        if (id) {
          const node = await service.GetById(id);
          if (!node) return { status: 204, body: {} };
          return new HttpResponse({ status: 200, body: node });
        }
        let sortQuery = defaultSorting || query.sort;
        if (sort) {
          sortQuery = GetSortingQuery(sort);
        }
  
        const keys = Object.keys(request.params);
        for (const i in keys) {
          query[keys[i]] = request.params[keys[i]];
        }
  
        if (q) {
          const qParsed = JSON.parse(q);
          const parsedKeys = Object.keys(qParsed);
          for (const i in parsedKeys) {
            if (qParsed[parsedKeys[i]].$regex != null) {
              query[parsedKeys[i]] = new RegExp(qParsed[parsedKeys[i]].$regex, 'i');
            } else {
              query[parsedKeys[i]] = qParsed[parsedKeys[i]];
            }
          }
        }
  
        if (page && limit) {
          const result = await service.Paginate(query, parseInt(page), parseInt(limit), sortQuery);
          return new HttpResponse({ status: 200, body: result });
        }
  
        const result = await service.GetAll(query, sortQuery);
        return new HttpResponse({ status: 200, body: result });
      } catch (err) {
        log.error('GetHandler', err.message, request);
        return new HttpResponse({ status: 500, body: { error: err.message } });
      }
    }
  
    /**
     * Handle the Delete request
     * @param { HttRequest } request
     * @returns  { HttpResponse }
     */
    async function DeleteHandler(request) {
      try {
        const { id } = request.params;
        if (!id) {
          return new HttpResponse({
            status: 400,
            body: { error: 'No id specified' },
          });
        }
        const query = GetUserQuery(request.user);
        query._id = id;
        const result = await service.DeleteMany(query);
        if (result.deletedCount === 1) {
          return new HttpResponse({ status: 204, body: {} });
        } else {
          return new HttpResponse({
            status: 500,
            body: { error: 'Delete failed, unknown reason' },
          });
        }
      } catch (err) {
        log.error('DeleteHandler', err.message, request);
        return new HttpResponse({ status: 500, body: { error: err.message } });
      }
    }
  
    /**
     * Handle the Post request
     * @param { HttRequest } request
     * @returns  { HttpResponse }
     */
    async function PostHandler(request) {
      try {
        const query = GetUserQuery(request.user);
        const item = request.body;
        item.clientId = request.body.clientId || query.clientId;
        if (!item.clientId && forceClientId) {
          return new HttpResponse({
            status: 400,
            body: { error: 'No clientId defined ' },
          });
        }
        const result = await service.Add(item);
        return { status: 200, body: result };
      } catch (err) {
        log.error('PostHandler', err.message, request);
        return new HttpResponse({ status: 500, body: { error: err.message } });
      }
    }
  
    /**
     * Handle the Put request
     * @param { HttRequest } request
     * @returns  { HttpResponse }
     */
    async function PutHandler(request) {
      try {
        const { id } = request.params;
        if (!id) {
          return new HttpResponse({
            status: 400,
            body: { error: 'No id specified' },
          });
        }
        const query = GetUserQuery(request.user);
        query._id = id;
        const result = await service.UpdateOne(query, request.body);
        if (result.nModified == 1) {
          return new HttpResponse({ status: 204, body: {} });
        } else {
          return new HttpResponse({
            status: 500,
            body: { error: 'Update failed for unknown reason' },
          });
        }
      } catch (err) {
        log.error('PutHandler', err.message, request);
        return new HttpResponse({ status: 500, body: { error: err.message } });
      }
    }
  
    /**
     * Handle requests
     * Express middleware
     * @param { Object } req
     * @param  { Object } res
     */
    async function RequestHandler(req, res, next) {
      const request = new HttpRequest(req);
      switch (request.method) {
        case 'GET':
          req.response = await GetHandler(request);
          break;
        case 'DELETE':
          req.response = await DeleteHandler(request);
          break;
        case 'POST':
          req.response = await PostHandler(request);
          break;
        case 'PUT':
          req.response = await PutHandler(request);
          break;
        default:
          req.response = new HttpResponse({
            status: 400,
            body: { error: 'Method not allowed' },
          });
          break;
      }
      next();
    }
  
    /**
     * Respond to the request
     * The response HttpResponse is stored in the req.response params by the previous middlewares
     * @param { Object } request
     * @param  { Object } response
     */
    async function ResponseHandler(req, res) {
      return res.status(req.response.status).send(req.response.body);
    }
  
    function RespondWithError(res, httpStatus) {
      return res.status(httpStatus.status).send({ error: httpStatus.message });
    }
  
    return {
      RequestHandler,
      GetUserQuery,
      ResponseHandler,
      GetHandler,
      DeleteHandler,
      PutHandler,
      PostHandler,
      RespondWithError,
      HTTPStatus: {
        SUCCESS: { status: 200, message: 'OK' },
        CREATED: { status: 201, message: 'Content Created' },
        ACCEPTED: { status: 202, message: 'Accepted, but no answer yet' },
        NOCONTENT: { status: 204, message: 'No Content' },
        BADREQUEST: { status: 400, message: 'Bad Request' },
        UNAUTHORIZED: { status: 401, message: 'Unauthorized' },
        FORBIDDEN: { status: 403, message: 'Forbidden' },
        NOTALLOWED: { status: 405, message: 'Not allowed' },
      },
      ParseQueryStringFromRequest,
    };
  };
  