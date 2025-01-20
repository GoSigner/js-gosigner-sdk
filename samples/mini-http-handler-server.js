const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const File = require('../src/File');
const PayloadComposer = require('../src/SignerRequest/PayloadComposer');
const Ui = require('../src/SignerRequest/Ui');
const Security = require('../src/SignerRequest/Security');
const SignatureSetting = require('../src/SignerRequest/SignatureSetting');
const PayloadParser = require('../src/SignerResponse/PayloadParser');

const ENV = "SANDBOX"; // For production, use PROD
const SHARED_USER = "sample"; // For testing only, for a PoC require your credential
const SHARED_KEY = "5daef7d64f955e1d3e61045001036d40"; // For testing only, for a PoC require your credential

// Function to handle each route
const handleRequest = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);  // Parse the URL to handle routes
  const query = parsedUrl.query;
  const pathname = parsedUrl.pathname;

  // Set header for HTML response
  res.writeHead(200, { 'Content-Type': 'text/html' });

  if (pathname === '/') {

    // Read the index.html file and send the response
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>Failed to load index.html</p>');
        return;
      }
      res.end(data); // Send the content of index.html
    });
  }
  else if (pathname === '/request-sign-view-modal' || pathname === '/request-sign-view-simple') {
    const { payloadData, payloadToken, apiToken, apiUiLinkWithToken } = await require('./request-sign');

    var htmlName = pathname === '/request-sign-view-modal' ? 'request-sign-view-modal.html' : 'request-sign-view-simple.html';

    // Read the html file and send the response
    fs.readFile(path.join(__dirname, htmlName), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>Failed to load ' + htmlName + '</p>');
        return;
      }

      console.log("PayloadData:", payloadData);
      data = data.replaceAll('$P{payloadData}', payloadData);

      console.log("PayloadToken:", payloadToken);
      data = data.replaceAll('$P{payloadToken}', payloadToken);

      data = data.replaceAll('$P{SHARED_USER}', SHARED_USER);

      Promise.all([apiToken, apiUiLinkWithToken])
        .then((results) => {
          console.log("ApiToken:", results[0]);
          data = data.replaceAll('$P{apiToken}', results[0]); //Replace var on static html sample
          console.log("apiUiLinkWithToken:", results[1]);
          data = data.replaceAll('$P{apiUiLinkWithToken}', results[1]); //Replace var on static html sample
          res.end(data);
        })
        .catch((error) => {
          console.error('One of the promises failed', error);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end('<h1>500 Internal error</h1><p>Internal error has ocorred</p>');
        });
    });
  } else if (pathname === '/request-session-view-modal' || pathname === '/request-session-view-simple') {
    const { payloadData, payloadToken, apiToken, apiUiLinkWithToken } = await require('./request-session');

    var htmlName = pathname === '/request-session-view-modal' ? 'request-session-view-modal.html' : 'request-session-view-simple.html';

    // Read the html file and send the response
    fs.readFile(path.join(__dirname, htmlName), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>Failed to load ' + htmlName + '</p>');
        return;
      }

      console.log("PayloadData:", payloadData);
      data = data.replaceAll('$P{payloadData}', payloadData);

      console.log("PayloadToken:", payloadToken);
      data = data.replaceAll('$P{payloadToken}', payloadToken);

      data = data.replaceAll('$P{SHARED_USER}', SHARED_USER);

      Promise.all([apiToken, apiUiLinkWithToken])
        .then((results) => {
          console.log("ApiToken:", results[0]);
          data = data.replaceAll('$P{apiToken}', results[0]); //Replace var on static html sample
          console.log("apiUiLinkWithToken:", results[1]);
          data = data.replaceAll('$P{apiUiLinkWithToken}', results[1]); //Replace var on static html sample
          res.end(data);
        })
        .catch((error) => {
          console.error('One of the promises failed', error);
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.end('<h1>500 Internal error</h1><p>Internal error has ocorred</p>');
        });
    });
  }
  else if (pathname === '/response-sign') {

    var htmlName = 'response-sign.html';

    const payloadParser = new PayloadParser();
    payloadParser.setEnv(ENV);
    payloadParser.setCredentials(SHARED_USER, SHARED_KEY);

    let fromTokenApi = null;
    let payloadData = null;

    var q = query.q;

    // Allow return only code to download (For large returns)
    // Use: payloadParser.setPayloadCallbackUrl(false);
    // Use: payloadParser.setPayloadCodeCallbackUrl(true);

    if (q.length === 36) { // Only token
      if (await payloadParser.findByToken(q)) {
        payloadData = JSON.stringify(payloadParser.getPayloadData(), null, 2);
        fromTokenApi = true;
      }
    }
    // Allow return full payload on callback (For small returns)
    // Use: payloadParser.setPayloadCallbackUrl(true);
    // Use: payloadParser.setPayloadCodeCallbackUrl(false);

    else if (q.length % 4 === 0 && Buffer.from(q, 'base64').toString('base64') === q) { // is a base64
      const decoded = JSON.parse(Buffer.from(q, 'base64').toString('utf-8'));
      payloadParser.setPayloadData(decoded);
      payloadData = JSON.stringify(payloadParser.getPayloadData(), null, 2);
      fromTokenApi = false;
    }

    // Unknown data on parameter
    else {
      errorMessage = "Unknown response";
      errorTrace = "...";
    }

    if (fromTokenApi !== null) {
      const files = payloadParser.getFiles();
      for (var i in files) {
        var file = files[i];
        console.log("File[" + file.id + "] = " + file.getSrc());
      }
    }

    console.log("PayloadData: " + payloadData);

    // Read the html file and send the response
    fs.readFile(path.join(__dirname, htmlName), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>Failed to load ' + htmlName + '</p>');
        return;
      }

      console.log("PayloadData:", payloadData);
      data = data.replaceAll('$P{payloadData}', payloadData);

      console.log("fromTokenApi:", fromTokenApi);
      data = data.replaceAll('$P{fromTokenApi}', fromTokenApi);

      res.end(data);
    });
  }
  else if (pathname === '/response-session') {
    try {
      var htmlName = 'response-sign.html';

      const payloadParserSession = new PayloadParser();
      payloadParserSession.setEnv(ENV);
      payloadParserSession.setCredentials(SHARED_USER, SHARED_KEY);

      let fromTokenApi = null;
      let payloadData = null;

      var q = query.q;

      // Allow return only code to download (For large returns)
      // Use: payloadParserSession.setPayloadCallbackUrl(false);
      // Use: payloadParserSession.setPayloadCodeCallbackUrl(true);

      if (q.length === 36) { // Only token
        if (await payloadParserSession.findByToken(q)) {
          payloadData = JSON.stringify(payloadParserSession.getPayloadData(), null, 2);
          fromTokenApi = true;
        }
      }
      // Allow return full payload on callback (For small returns)
      // Use: payloadParserSession.setPayloadCallbackUrl(true);
      // Use: payloadParserSession.setPayloadCodeCallbackUrl(false);

      else if (q.length % 4 === 0 && Buffer.from(q, 'base64').toString('base64') === q) { // is a base64
        const decoded = JSON.parse(Buffer.from(q, 'base64').toString('utf-8'));
        payloadParserSession.setPayloadData(decoded);
        payloadData = JSON.stringify(payloadParserSession.getPayloadData(), null, 2);
        fromTokenApi = false;
      }

      // Unknown data on parameter
      else {
        errorMessage = "Unknown response";
        errorTrace = "...";
      }

      //Did everything go ok? Use session token to sign a mocked PDF file (Storage this: selected certificate and token session)
      if (payloadParserSession.getPayloadSelectedCertificateSession() !== '' && payloadParserSession.getPayloadSelectedCertificateSession() !== null) {

        let payloadComposer = new PayloadComposer();
        payloadComposer.setEnv(ENV);
        payloadComposer.setCredentials(SHARED_USER, SHARED_KEY);
        payloadComposer.setWebhookUrl("https://webhook.site/38c373d8-92bc-41b3-9978-6c67aa89ad3b");

        let file1 = new File();
        file1.setName("My file name sample 1");
        file1.setDescription("My file description sample 1");
        file1.setSrc("https://www.gemboxsoftware.com/pdf/examples/204/resources/Hello%20World.pdf");
        let file1SignatureSettings = new SignatureSetting();
        file1SignatureSettings.setType("DOC-pdf");
        file1SignatureSettings.setVisibleSignatureCustomTemplateSrc("https://gestao-online-sites.s3.sa-east-1.amazonaws.com/gocrypto.com.br/assets/tests/template.html");
        file1SignatureSettings.setVisibleSignAppearanceConfig(1, 150, 300, 200, 28);
        file1.setSignatureSetting(file1SignatureSettings);
        payloadComposer.addFile(file1);

        // let file2 = new File();
        // file2.setName("My file name sample 2");
        // file2.setDescription("My file description sample 2");
        // file2.setSrc("https://www.gemboxsoftware.com/pdf/examples/204/resources/Hello%20World.pdf");
        // let file2SignatureSettings = new SignatureSetting();
        // file2SignatureSettings.setType("DOC-pdf");
        // file2SignatureSettings.setPolicy("PAdES-AD_RB");
        // file2SignatureSettings.setVisibleSignAppearanceConfig(1, 390, 10, 200, 28);
        // file2.setSignatureSetting(file2SignatureSettings);
        // payloadComposer.addFile(file2);

        console.log("Selected certificate: " + payloadParserSession.getPayloadSelectedCertificateSession());
        console.log("Token session: " + payloadParserSession.getPayloadTokenSession());
        payloadDataResponse = payloadComposer.signBackground(payloadParserSession.getPayloadTokenSession());

        Promise.all([payloadDataResponse])
          .then((results) => {

            let payloadParser = new PayloadParser();
            payloadParser.setEnv(ENV);
            payloadParser.setCredentials(SHARED_USER, SHARED_KEY);
            payloadParser.setPayloadData(results[0]);

            const files = payloadParser.getFiles();
            for (var i in files) {
              var file = files[i];
              console.log("File[" + file.id + "] = " + file.getSrc());
            }

            // Read the html file and send the response
            fs.readFile(path.join(__dirname, htmlName), 'utf8', (err, data) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1><p>Failed to load ' + htmlName + '</p>');
                return;
              }

              console.log("PayloadData:", JSON.stringify(payloadParser.getPayloadData()));
              data = data.replaceAll('$P{payloadData}', JSON.stringify(payloadParser.getPayloadData()));
              data = data.replaceAll('$P{fromTokenApi}', true);

              res.end(data);
            });
          })
          .catch((error) => {
            console.error('One of the promises failed', error);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>500 Internal error</h1><p>Internal error has ocorred</p>');
          });
      }
      else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h1>400 - You need select a certificate, empty: payloadParserSession.getPayloadSelectedCertificateSession()');
      }
    }
    catch (ex) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>500 Internal Server Error</h1><p>Error: ' + ex + '</p>');
    }
  }
  else {
    // Default response for any unknown route
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1><p>Route not found.</p>');
  }
};

// Create the server and listen on port 9000
const server = http.createServer(handleRequest);

server.listen(9000, () => {
  console.log('Server running at http://localhost:9000');
});
