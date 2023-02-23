import EnvWrap from '../utils/envWrapper';

const authConfig = {
  github: {
    clientID: <string>EnvWrap.get().value('AUTH_GITHUB_CLIENTID'),
    clientSecret: <string>EnvWrap.get().value('AUTH_GITHUB_CLIENTSECRET'),
    callbackURL: <string>EnvWrap.get().value('AUTH_GITHUB_CALLBACKURL'),
  },
};

export default authConfig;
