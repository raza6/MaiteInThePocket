const dayjs = require('dayjs');

function currentTimeLog() {
  return dayjs().format('YYYY/MM/DD-HH:mm:ss');
}

module.exports = { currentTimeLog };