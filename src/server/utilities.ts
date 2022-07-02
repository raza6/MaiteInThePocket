import dayjs from 'dayjs';

function currentTimeLog(): string {
  return dayjs().format('YYYY/MM/DD-HH:mm:ss');
}

export = { currentTimeLog };