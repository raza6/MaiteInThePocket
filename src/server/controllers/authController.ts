import { Request, Response, Express } from 'express';
import { PassportStatic } from 'passport';
import { ensureAuthenticated } from '../utils/utils';
import EnvWrap from '../utils/envWrapper';

/**
 * API
 */
const authController = (serv: Express, passport: PassportStatic) => {
  serv.get('/mp/auth/check', ensureAuthenticated, (req: Request, res: Response) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        user: req.user,
        cookies: req.cookies,
      });
    }
  });

  serv.get('/mp/auth/error', (req: Request, res: Response) => {
    console.log('🔑 Authentication error');
    res.status(401).send('An error occured during authentication');
  });

  serv.post('/mp/auth/logout', (req: Request, res: Response) => {
    req.logOut(() => {
      res.status(200).send('Logout successful');
    });
  });

  serv.get(
    '/mp/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }),
  );

  serv.get(
    '/mp/auth/github/callback',
    passport.authenticate(
      'github',
      {
        failureRedirect: '/mp/auth/error',
        successRedirect: `${EnvWrap.get().value('AUTH_APP_URL')}/app/login`,
      },
    ),
  );
};
export default authController;
