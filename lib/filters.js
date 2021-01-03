const { DateTime } = require("luxon");

module.exports = {
  w3Date: (dateObj) => DateTime.fromJSDate(dateObj).toString(),
  displayDate: (dateObj) =>
    DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL),
};
