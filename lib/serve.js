var fs = require('fs');
var Promise = require('bluebird');

readFile = function(path){
  return new Promise(function(resolve, reject){
    fs.readFile(__projectPath+'/'+path, "utf-8", function(err, data) {
      if(err) {
        reject(err);
      }
      resolve( data.toString() )
    });
  });
};

// TODO : Improve call to controller and handle interpolation
runCustomController = function(path, req, res, next){
  // console.log('controller', req.params)
  var func = require(__projectPath+'/'+path);
  console.log('func to string', func);
  return func.controller(req, res, next);
};

bindMockMarkers = function(content, params){
  for(var i in params) {
    content = content.replace(new RegExp('{{req.'+i+'}}', 'g'), params[i]);
  }
  return content;
};

exports.getContentByType = function(server, type, toServe, req, res, next, route){
  console.log('before promise', route, req.params, req.body)
  return new Promise(function(resolve, reject){
    if(type === 'file') {
      // console.log('file', req.params)
      readFile(server.config.path+'/'+toServe).then(function(content){
        resolve( JSON.parse(bindMockMarkers(content, req.params)) )
      }, reject);
    } else if(type === 'func') {
      // console.log('func', req.params)
      runCustomController(server.config.path+'/'+toServe, req, res, next);
      resolve(null);
    } else if(type === 'raw') {
      resolve( bindMockMarkers(toServe, req.params) )
    } else {
      reject( new Error('Unknown mockType') );
    }
  });
};
