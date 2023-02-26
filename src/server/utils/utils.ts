import { Request, Response } from 'express';
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

function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.sendStatus(401);
}

export { currentTimeLog, NoCollectionError, ensureAuthenticated };
