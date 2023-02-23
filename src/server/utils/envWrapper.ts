import dotenv from 'dotenv';

class EnvWrapper {
  constructor() {
    dotenv.config();
  }

  // eslint-disable-next-line class-methods-use-this
  value(name: string, def?: string | undefined): string | undefined {
    return process.env[name] ?? def;
  }
}

const EnvWrap = (() => {
  let instance: EnvWrapper;

  function createInstance() {
    const envObj = new EnvWrapper();
    return envObj;
  }

  return {
    get: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export default EnvWrap;
