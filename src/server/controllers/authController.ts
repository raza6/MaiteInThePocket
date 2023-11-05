import { Request, Response, Express } from 'express';
import { PassportStatic } from 'passport';
import { ensureAuthenticated } from '../utils/utils';
import EnvWrap from '../utils/envWrapper';

/**
 * API
 */
const authController = (serv: Express, passport: PassportStatic) => {
  /**
   * @apiName AuthCheck
   * @apiGroup Auth
   * @api {GET} /mp/auth/check Check current user auth
   * @apiDescription Return 200 with user info if login is successful, 401 otherwise
   *
   * @apiSuccess {boolean} success Always true
   * @apiSuccess {User} user Current user (id, name, avatar and origin)
   * @apiError (401) {null} UserNotAuthenticated
   */
  serv.get('/mp/auth/check', ensureAuthenticated, (req: Request, res: Response) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        user: req.user,
        cookies: req.cookies,
      });
    }
  });

  /**
   * @apiName AuthError
   * @apiGroup Auth
   * @api {GET} /mp/auth/error Redirection for auth failure
   *
   * @apiError (401) {string} AuthenticationFailure An error occured during authentication
   */
  serv.get('/mp/auth/error', (req: Request, res: Response) => {
    console.log('🔑 Authentication error');
    res.status(401).send('An error occured during authentication');
  });

  /**
   * @apiName AuthLogout
   * @apiGroup Auth
   * @api {POST} /mp/auth/logout Logout current user
   *
   * @apiDescription Will return a 200 with "Logout successful" if logout worked for the current user
   */
  serv.post('/mp/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send('An error occured while logging out');
      }

      res.status(200).send('Logout successful');
    });
  });

  /**
   * @apiName AuthGithub
   * @apiGroup Auth
   * @api {GET} /mp/auth/github Login through Github
   *
   * @apiDescription Redirect to Github OAuth page to carry on authentication pipeline
   */
  serv.get(
    '/mp/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }),
  );

  /**
   * @apiName AuthGithubCallback
   * @apiGroup Auth
   * @api {GET} /mp/auth/github/callback Github OAuth callback
   *
   * @apiDescription If successful, redirect to home page. Else, redirect to AuthError endpoint
   */
  serv.get(
    '/mp/auth/github/callback',
    passport.authenticate(
      'github',
      {
        failureRedirect: '/mp/auth/error',
        successRedirect: EnvWrap.get().value('AUTH_APP_URL'),
      },
    ),
  );
};
export default authController;
