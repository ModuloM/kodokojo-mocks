exports.controller = function(req, res, next) {
  res.contentType = "application/json";
  
  console.log('res', res.body)

  next();
};