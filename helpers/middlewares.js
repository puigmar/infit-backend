const createError = require('http-errors');

exports.isLoggedIn = () => (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else { 
    next(createError(401));
  }
};

exports.isNotLoggedIn = () => (req, res, next) => {
  console.log('isNotLoggedIn',req.session.currentUser)
  if (!req.session.currentUser) next();
  else next(createError(403));
};

exports.validationLoggin = () => (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) next(createError(400));
  else next();
}
