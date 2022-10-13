import dayjs from 'dayjs';

function currentTimeLog(): string {
  return dayjs().format('YYYY/MM/DD-HH:mm:ss');
}

class NoCollectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoCollectionError';
  }
}

export { currentTimeLog, NoCollectionError };
