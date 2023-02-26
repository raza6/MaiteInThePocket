import { PassportStatic } from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Express } from 'express';
import { EAuthOrigin } from '../types/user';
import authConfig from './authConfig';
import MongoDB from '../mongo/mongo';

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
          const { _json: jsonGithubUser } = profile;
          const cleanUser = {
            name: jsonGithubUser.name, id: jsonGithubUser.id, avatar: jsonGithubUser.avatar_url, origin: EAuthOrigin.Github,
          };

          let userExist = false;
          const mongo = new MongoDB();
          userExist = await mongo.checkUser(cleanUser.id);
          if (!userExist) {
            console.log('🔒 Creating new user...');
            await mongo.addUser(cleanUser);
          }

          return done(null, cleanUser);
        } catch (error) {
          console.log('🧨 Error while authenticating via Github', error);
          return done(<Error>error, undefined);
        }
      },
    ),
  );
};
export default githubAuthConfig;
