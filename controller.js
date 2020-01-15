const router = require('./router');
const User = require('./model')

exports.home = (req, res) => {
  res.render('index')
}

exports.createProfile = (req, res) => {
  console.log(req.body.firstName, req.body.lastName, req.body.email, req.body.password)
  res.send("Thank for for submitting your profile")
}


