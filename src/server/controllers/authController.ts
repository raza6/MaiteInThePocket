import { Request, Response, Express } from 'express';
import { PassportStatic } from 'passport';

/**
 * API
 */
const authController = (serv: Express, passport: PassportStatic) => {
  serv.get('/auth/test', (req: Request, res: Response) => {
    console.log('auth hello');
    res.status(200).send('auth hello');
  });

  serv.get('/auth/error', (req: Request, res: Response) => {
    console.log('auth error');
    res.status(401).send('auth error');
  });

  serv.get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }),
  );

  serv.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/error' }),
    (req: Request, res: Response) => {
      res.redirect('/auth/test');
    },
  );
};
export default authController;
