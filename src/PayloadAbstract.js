class PayloadAbstract {
  
  constructor() {
      this.credentials = {
          user: null,
          key: null,
      };
      this.env = "STAGE";
  }

  setCredentials(user, key) {
      this.credentials.user = user;
      this.credentials.key = key;
  }

  getEnv() {
      return this.env;
  }

  setEnv(env) {
      this.env = env;
  }

  getBaseUrl() {
      // Configure base URLs based on the environment
      let baseUrl;

      switch (this.env) {
          case "PROD":
              baseUrl = "https://api.gosigner.com.br";
              break;
          case "SANDBOX":
          case "STAGE":
              baseUrl = "https://api-stage.gosigner.com.br";
              break;
          case "DEV":
              baseUrl = "https://api-dev.gosigner.com.br";
              break;
          case "LOCAL":
              baseUrl = "http://192.168.0.127:8081"; // Internal Gosigner usage
              break;
          default:
              throw new Error("Invalid environment: " + this.env);
      }

      return baseUrl;
  }
}

module.exports = PayloadAbstract;
