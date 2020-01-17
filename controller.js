const router = require('./router');
const User = require('./model');

exports.home = (req, res) => {
  res.render('home-guest')
}

exports.registrationPage = (req, res) => {
  res.render('registrationPage');
}
exports.registrationSubmission = (req, res) => {
  let user = new User(req.body);
  user.register()
  .then(()=>{
    console.log("success!")
  })
  .catch(()=>{
    console.log("failure!")
  })

  res.send("Thank for for submitting your profile!");
}
exports.login = (req, res) => {
    let user = new User(req.body);

    user.login()
        .then(()=> {
          res.send("Login successful")
        })
        .catch(err => res.send("Login failed!")) 
}


