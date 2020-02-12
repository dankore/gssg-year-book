const photoUrls = [
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580491991787",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580504019570",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580503409242",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580506011094",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580504838127",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580508390094",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580583044348",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580585257999",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580619180555",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580621580440",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580629627915",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1580652985987",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1581317427648",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1581324760805",
  "https://gss-gwarinpa.s3.us-east-2.amazonaws.com/1581379391579"
];

module.exports = function photo_urls(req, res, next) {
  //
  // Source of helper https://stackoverflow.com/questions/2450954/
  // how-to-randomize-shuffle-a-javascript-array/2450976#2450976
  //

  var currentIndex = photoUrls.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = photoUrls[currentIndex];
    photoUrls[currentIndex] = photoUrls[randomIndex];
    photoUrls[randomIndex] = temporaryValue;
  }

  res.locals.photoUrl = photoUrls;
  next();
};
