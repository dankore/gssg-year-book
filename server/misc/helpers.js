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

// HOURS MINUTES
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
  return h + ":" + m;
};
// HOURS MINUTES
// MONTH DAY YEAR
const getMonthDayYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const yearFormated = ("" + year).slice(2); // GET LAST TWO DIGITS
  const monthFormated = formatMonth(month);
  const dayFormated = addZero(day);
  return `${monthFormated}. ${dayFormated}, '${yearFormated}`;
};

function formatMonth(num) {
  switch (num) {
    case 1:
      return "Jan";
      break;
    case 2:
      return "Feb";
      break;
    case 3:
      return "Mar";
      break;
    case 4:
      return "Apr";
      break;
    case 5:
      return "May";
      break;
    case 6:
      return "Jun";
      break;
    case 7:
      return "Jul";
      break;
    case 8:
      return "Aug";
      break;
    case 9:
      return "Sep";
      break;
    case 10:
      return "Oct";
      break;
    case 11:
      return "Nov";
      break;
    case 12:
      return "Dec";
  }
}
exports.isAlphaNumericDashHyphen = isAlphaNumericDashHyphen;
exports.statsByYear = statsByYear;
exports.getEmailFromHeadersReferrer = getEmailFromHeadersReferrer;
exports.getHMS = getHMS;
exports.getMonthDayYear = getMonthDayYear;
