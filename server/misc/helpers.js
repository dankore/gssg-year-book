// VALIDATION: ALLOWS ONLY LETTERS, NUMBERS, DASHES, AND HYPHENS
const isAlphaNumericDashHyphen = stringInput => {
  return /^[\w-]+$/.test(stringInput);
};

// STATS : GET YEAR AND NUMBER OF PROFILES PER YEAR.
const statsByYear = allProfiles => {
  let yearsArray = allProfiles.map(item => item.year);
  let obj = {};

  for (var i = 0; i < yearsArray.length; i++) {
    !obj.hasOwnProperty(yearsArray[i])
      ? (obj[yearsArray[i]] = 1)
      : (obj[yearsArray[i]] += 1);
  }

  return [Object.keys(obj), Object.values(obj)];
};

const getEmailFromHeadersReferrer = urlString => {
  const urlArray = urlString.split("/");
  const email = urlArray[urlArray.length - 1];

  return email;
};

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const getHMS = _ => {
  var d = new Date();
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  return h + ":" + m
};
exports.isAlphaNumericDashHyphen = isAlphaNumericDashHyphen;
exports.statsByYear = statsByYear;
exports.getEmailFromHeadersReferrer = getEmailFromHeadersReferrer;
exports.getHMS = getHMS;
