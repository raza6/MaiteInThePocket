import { PassportStatic } from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Express } from 'express';
import authConfig from './authConfig';

const githubAuthConfig = (passport: PassportStatic) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, <Express.User>user);
  });

  passport.use(
    new GithubStrategy(
      {
        clientID: authConfig.github.clientID,
        clientSecret: authConfig.github.clientSecret,
        callbackURL: authConfig.github.callbackURL,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // TODO
          console.log('auth github strat', request, accessToken, refreshToken, profile);
          const existingUser = { email: 'emailtest', id: 1 };
          if (existingUser) {
            return done(null, existingUser);
          }
          console.log('Creating new user...');
          return done(null, existingUser);
        } catch (error) {
          return done(<Error>error, false);
        }
      },
    ),
  );
};
export default githubAuthConfig;
