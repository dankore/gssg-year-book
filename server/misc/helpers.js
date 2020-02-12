// VALIDATION: ALLOWS ONLY LETTERS, NUMBERS, DASHES, AND HYPHENS
const isAlphaNumericDashHyphen = stringInput => {
  return /^[\w-]+$/.test(stringInput)
}

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

exports.isAlphaNumericDashHyphen = isAlphaNumericDashHyphen;
exports.statsByYear = statsByYear;
// exports.getSomeUsersPhotoURL = getSomeUsersPhotoURL;
