const router = require('./router');
const User = require('./model')

exports.home = (req, res) => {
  res.render('home-guest')
}

exports.registrationPage = (req, res) => {
  res.render('registrationPage');
}
exports.registrationSubmission = (req, res) => {
  let user = new User(req.body);
  user.register().then(()=>{
    console.log("success!")
  })
  .catch(()=>{
    console.log("failure!")
  })

  res.send("Thank for for submitting your profile!");
}
exports.loginPage = (req, res) => {
  res.render('loginPage')
}


