// SORT PROFILES
const sortProfiles = array => {
 return array.sort((a, b) => {
    if(a.likes_received_from && b.likes_received_from){
        const aNumComments = a.comments.length
        const bNumComments = b.comments.length
        const aNumLikesReceived = a.likes_received_from.filter( item => item.color == "yes").length // IF COLOR VALUE IS YES IT MEANS THE PROFILE IS LIKED
        const bNumLikesReceived = b.likes_received_from.filter( item => item.color == "yes").length
        
        return (bNumComments + bNumLikesReceived) - (aNumComments + aNumLikesReceived);
      } else {
        return b.comments.length - a.comments.length
      }
    });
}

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
  var h = addZero(d.getUTCHours() - d.getTimezoneOffset()/60);
  var m = addZero(d.getUTCMinutes());
  return h + ":" + m;
};
// HOURS MINUTES
// MONTH DAY YEAR
const getMonthDayYear = () => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const yearFormated = ("" + year).slice(2); // GET LAST TWO DIGITS
  const monthFormated = formatMonth(month);
  const dayFormated = addZero(day);
  return `${monthFormated}. ${dayFormated}, '${yearFormated}`;
};

function formatMonth(num) {
  switch (num) {
    case 0:
      return "Jan";
      break;
    case 1:
      return "Feb";
      break;
    case 2:
      return "Mar";
      break;
    case 3:
      return "Apr";
      break;
    case 4:
      return "May";
      break;
    case 5:
      return "Jun";
      break;
    case 6:
      return "Jul";
      break;
    case 7:
      return "Aug";
      break;
    case 8:
      return "Sep";
      break;
    case 9:
      return "Oct";
      break;
    case 10:
      return "Nov";
      break;
    case 11:
      return "Dec";
  }
}
exports.isAlphaNumericDashHyphen = isAlphaNumericDashHyphen;
exports.statsByYear = statsByYear;
exports.getEmailFromHeadersReferrer = getEmailFromHeadersReferrer;
exports.getHMS = getHMS;
exports.getMonthDayYear = getMonthDayYear;
exports.sortProfiles = sortProfiles;