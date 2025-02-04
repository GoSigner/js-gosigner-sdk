const File = require('../src/File');
const PayloadComposer = require('../src/SignerRequest/PayloadComposer');
const Ui = require('../src/SignerRequest/Ui');
const Security = require('../src/SignerRequest/Security');
const SignatureSetting = require('../src/SignerRequest/SignatureSetting')

const ENV = "SANDBOX"; // For production, use "PROD"
const SHARED_USER = "sample"; // For testing only, provide your credentials for a PoC
const SHARED_KEY = "5daef7d64f955e1d3e61045001036d40"; // For testing only, provide your credentials for a PoC

let errorMessage = '';
let errorTrace = '';

let payloadData = '';
let payloadToken = '';
let apiToken = '';
let apiUiLinkWithToken = '';

try {
    // Initialize the payload composer
    const payloadComposer = new PayloadComposer();
    payloadComposer.setEnv(ENV);
    payloadComposer.setCredentials(SHARED_USER, SHARED_KEY);

    // For testing purposes only, avoid using this in production
    payloadComposer.setSkipCorsFileUrl(true);

    // Set callback and webhook URLs
    //payloadComposer.setCallbackUrl("https://meulink.com.br?token=");
    payloadComposer.setCallbackUrl("http://localhost:9000/response-session?q=");
    payloadComposer.setWebhookUrl("https://webhook.site/38c373d8-92bc-41b3-9978-6c67aa89ad3b");

    // Configure UI settings
    const payloadUi = new Ui();
    payloadUi.setButton("Abrir sessão");
    // payloadUi.setUsername("04660457192"); // CPF or CNPJ
    payloadUi.setColor("#FFFF00");
    payloadUi.setBg("#f9f9f9");
    payloadUi.setScope("signature_session");
    payloadUi.setLifetime(60 * 60 * 24 * 7); // 7 days in seconds
    payloadUi.setPreferPreview("description");
    payloadComposer.setUi(payloadUi);

    //Filter CPF/CNPJ on list certificates
    // var filters = [
    //     {
    //         "validity": "now",
    //         "issuer=>organizationName": "ICP-Brasil",
    //         "subjectAltName=>otherName=>2.16.76.1.3.1": "********04660457192**************************"
    //     }
    // ];
    // payloadComposer.setCertificatesFilters(filters);

    // Configure security settings
    const payloadSecurity = new Security();
    //payloadSecurity.setAllowChangeUsername(false);
    payloadSecurity.setAllowEditLifetime(false);
    payloadSecurity.setAllowEditScope(false);
    payloadSecurity.setAllowAutocontinue(true);

    payloadSecurity.addProviderType("CLOUD"); //Default is LOCAL and CLOUD
    payloadComposer.setSecurity(payloadSecurity);

    payloadComposer.setSessionDescription("Ao autorizar, você permite que o software EXEMPLO 123 utilize o seu certificado. Finalidades de Xpto1, xpto2 etc");

    // Generate payload data and token
    payloadData = payloadComposer.toJson();
    payloadToken = payloadComposer.generateToken();
    apiToken = payloadComposer.signForegroundLink(true);
    apiUiLinkWithToken = payloadComposer.signForegroundLink(false);

} catch (ex) {
    // Handle exceptions and log error details
    errorMessage = ex.message;
    errorTrace = ex.stack;
    console.error({ errorMessage, errorTrace });
}

module.exports = {
    payloadData,
    payloadToken,
    apiToken,
    apiUiLinkWithToken
};