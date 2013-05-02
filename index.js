
/**
 * Module dependencies.
 */

var debug = require('simple-debug')("requireScopes:middleware:debug")
  , metric = require('metric-log').context({ fn: 'requireScope' })
  , util = require('util');


/**
 * Create a scope restriction middleware
 *
 * @param {String} scope  the scope required to continue this request
 * @return {Function}  middleware which enforces the restriction
 * @api public
 */

exports = module.exports = function(scope) {

  return function requireScope(req, res, next) {
    if (!req.authInfo.scopes) {
      res.status(404);
      debug('No scopes found. ' + req.url + ' requires ' + scope);
      metric({ measure:'requests.denied', val: 1, at:'no-scopes' });
      return next('No scopes found for user.');
    }

    if (req.authInfo.scopes.indexOf(scope) === -1) {
      res.status(404);
      debug(req.url + ' requires ' + scope + ', but user only has ' + util.inspect(req.authInfo.scopes));
      metric({ measure:'requests.denied', val: 1, at:'scope-missing' });
      return next('Scope not found for user.');
    }

    next();
  };

};