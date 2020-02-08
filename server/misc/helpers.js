
const isAlphaNumericDashHyphen = stringInput => {
  return /^[\w-]+$/.test(stringInput)
}

exports.isAlphaNumericDashHyphen = isAlphaNumericDashHyphen;
