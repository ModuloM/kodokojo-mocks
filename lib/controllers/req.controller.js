var serve = require(__base+'serve.js');

var controller = function(server, route, logger){
  return function(req, res, next){
    // console.log('first', req.params)
    return serve
      .getContentByType(server, route.mockType, route.serve, req, res, next, route)
      .then(function(content){
        var controllerContentType = res.contentType;
        res.contentType = route.mockType === 'raw' ? "text/plain" : controllerContentType ? controllerContentType : "application/json";
        if (content) {
          res.send(content);
        }
        logger.log('Mock ['+route.method+'] '+route.path+' served');
        next();
      });
  }
};

module.exports = controller;