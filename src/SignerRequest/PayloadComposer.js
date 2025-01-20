const axios = require('axios');
const crypto = require('crypto');
const PayloadAbstract = require('../PayloadAbstract');
const File = require('../File');
const Security = require('./Security');
const SignatureSetting = require('./SignatureSetting');
const Ui = require('./Ui');

class PayloadComposer extends PayloadAbstract {
  constructor() {
    super();
    this.skipCorsFile = false;
    this.callbackUrl = null;
    this.webhookUrl = null;
    this.security = null;
    this.ui = null;
    this.extraKeys = [];
    this.files = [];
    this.certificates = null;
    this.session = {};
  }

  getSkipCorsFileUrl() {
    return this.skipCorsFile;
  }

  setSkipCorsFileUrl(skipCorsFile) {
    this.skipCorsFile = skipCorsFile;
  }

  getCallbackUrl() {
    return this.callbackUrl;
  }

  setCallbackUrl(callbackUrl) {
    this.callbackUrl = callbackUrl;
  }

  getWebhookUrl() {
    return this.webhookUrl;
  }

  setWebhookUrl(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  getSecurity() {
    return this.security;
  }

  setSecurity(security) {
    this.security = security;
  }

  getUi() {
    return this.ui;
  }

  setUi(ui) {
    this.ui = ui;
  }

  setExtraKeys(extraKeys) {
    this.extraKeys = extraKeys;
  }

  getExtraKeys() {
    return this.extraKeys;
  }

  addExtraKey(name, value) {
    this.extraKeys.push({ name, value });
  }

  getFiles() {
    return this.files;
  }

  setFiles(files) {
    this.files = files;
  }

  addFile(file) {
    this.files.push(file);
  }

  setSessionDescription(description) {
    this.session = {
      description,
      request: true
    };
  }

  setCertificatesFilters(filters) {
    for (const filter of filters) {
      for (const filterKey in filter) {
        const filterValue = filter[filterKey];
        switch (filterKey) {
          case "validity":
          case "issuer=>organizationName":
          case "subjectAltName=>otherName=>2.16.76.1.3.1":
          case "subjectAltName=>otherName=>2.16.76.1.3.3":
          case "cn":
            break;
          default:
            throw new Error(`${filterKey} is not allowed to certificate filter`);
        }
      }
    }
    this.certificates = { filters };
  }

  toArray() {
    const data = {};

    if (this.security) {
      data.security = this.security.toArray();
    }

    if (this.files.length > 0) {
      data.files = this.files.map(file => file.toArray ? file.toArray() : file);

      if (this.skipCorsFile) {
        data.files = data.files.map(file => ({
          ...file,
          src: `${this.getBaseUrl().replace(/\/$/, "")}/resolve?download-without-cors=${encodeURIComponent(file.src)}`
        }));
      }
    }

    if (this.extraKeys.length > 0) {
      data.extraKeys = this.extraKeys;
    }

    if (this.ui) {
      data.ui = this.ui.toArray();
    }

    if (this.certificates) {
      data.certificates = this.certificates;
    }

    if (Object.keys(this.session).length > 0) {
      data.session = this.session;
    }

    if (this.callbackUrl) {
      data.callbackUrl = this.callbackUrl;
    }

    if (this.webhookUrl) {
      data.webhookUrl = this.webhookUrl;
    }

    return data;
  }

  toJson() {
    return JSON.stringify(this.toArray());
  }

  generateToken() {
    if (!this.credentials?.key) {
      throw new Error("Invalid credentials key");
    }

    const payloadJson = this.toJson();
    const payloadEncoded = Buffer.from(payloadJson).toString('base64');
    const nonce = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const token = `${nonce}-${crypto.createHash('md5').update(`${nonce}${this.credentials.key}${crypto.createHash('md5').update(payloadEncoded).digest('hex')}`).digest('hex')}`;

    return token;
  }

  signForegroundLink(onlyToken = true, callback) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl.replace(/\/$/, "")}/transaction-payload`;
    const postData = {
      partner: this.credentials.user,
      token: this.generateToken(),
      payload: Buffer.from(this.toJson()).toString('base64')
    };
  
    axios.post(url, postData, { headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        const responseData = response.data;
  
        if (onlyToken && responseData.payloadCode) {
          callback(null, responseData.payloadCode);
        } else if (!onlyToken && responseData.redirectTo) {
          callback(null, responseData.redirectTo);
        } else {
          callback(new Error("Failed to generate token"));
        }
      })
      .catch(error => {
        callback(new Error(`API error: ${error.response ? `HTTP status code ${error.response.status}, response: ${error.response.data}` : error.message}`));
      });
  }
  

  signBackground(token, callback) {
    const [username, password] = token.split(":");
    const [bearerToken, providerId] = password.split("@");
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl.replace(/\/$/, "")}/sign`;
  
    axios.post(url, this.toJson(), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      }
    })
    .then(response => {
      callback(null, response.data);
    })
    .catch(error => {
      callback(new Error(`API error: ${error.response ? `HTTP status code ${error.response.status}, response: ${error.response.data}` : error.message}`));
    });
  }

  /*
    this.signBackground("username:password@providerId", (err, result) => {
    if (err) {
      console.error("Error:", err.message);
      return;
    }
    console.log("Result:", result);
  });*/
}

module.exports = PayloadComposer;
