# GoSigner NODE/JS SDK

Uma biblioteca para integrar sua aplicação com os serviços do GoCrypto (https://docs.gocrypto.com.br).

## O que é a solução?

Unificamos e simplificamos o uso de diversos dispositivos criptográficos em uma única plataforma de rápida integração. Cuidamos de todo o ciclo de vida do processo desde a autenticação, tokenização e geração dos resumos criptográficos. 

## Essa solução é a ideal para o meu negócio?

Precisa oferecer suporte a assinatura e/ou criptografia nos padrões ICP-Brasil no seu sistema e não quer perder tempo desenvolvendo e mantendo uma solução para comunicação com certificados A1/A3 e ainda se preocupando com diversos protocolos de conexão com smartcards/tokens etc? Se sim, essa é a solução ideal para você conseguir estar a frente do mercado e continuar com o foco principal do seu software.

## Quais são os dispositivos compatíveis?

São compatíveis todos os certificados digitais aderentes a ICP-Brasil. O que é preciso observar é onde esse certificado está armazenado.

Os certificados comumente encontrados no mercado são os do tipo A1 e A3. Aí que está a principal diferença, os certificados do tipo A3 precisam ser emitidos e armazenados em dispositivos de segurança tais como: tokens, cartões e HSMs. Já os certificados do tipo A1 podem ser emitidos diretamente no seu computador fora de um hardware de segurança específico para tal finalidade (por isso os certificados A1 possuem um nível de classificação de segurança inferior e consequentemente só podem receber um menor tempo de expiração/vencimento)

No universo WEB acessar dispositivos de hardware via porta USB/rede (A3) ou arquivos na máquina (A1) requerem um plugin para possibilitar a comunicação do site web com um componente local instalado na máquina. A nossa plataforma possui um plugin próprio e abstrai toda a comunicação entre esses componentes, tornando indiferente para o processo de assinatura o tipo de certificado e se ele está armazenado em um arquivo, token/smartcard.

Também somos compatíveis com o mais novo padrão da ICP-Brasil, o certificado em nuvem: O certificado em nuvem pode ser um A1/A3 que fica armazenado na infraestrutura de um PSC - (Prestador de serviço de confiança credenciado ICP Brasil). Esse armazenamento em nuvem possui diversas vantagens tanto no uso quanto na segurança, com o uso do certificado em nuvem a nossa plataforma não requer o uso do plugin instalado no computador para realizar as operações criptografícas, podendo ser feitas até mesmo em um smartphone ou tablet.

---

## Instalação

Você pode instalar esta biblioteca diretamente no seu projeto em nodejs do utilizando o repositório NPM.

```bash
npm install js-gosigner-sdk --save
```

## Exemplo de Uso (Lib NODEJS)

Aqui está um exemplo de como usar a biblioteca:

```js
const {PayloadParser} = require('js-gosigner-sdk');

try{
    const ENV = "SANDBOX"; // For production, use PROD
    const SHARED_USER = "sample"; // For testing only, for a PoC require your credential
    const SHARED_KEY = "5daef7d64f955e1d3e61045001036d40"; // For testing only, for a PoC require your credential
    
    const payloadParser = new PayloadParser();
    payloadParser.setEnv(ENV);
    payloadParser.setCredentials(SHARED_USER, SHARED_KEY);
    payloadParser.setPayloadData({
      "documents": [
        {
          "id": 0,
          "downloadLink": "https://api-stage.gosigner.com.br/file-download?name=0-c5322dba85290d1b499cfb675a90768a8d49e598.pdf"
        },
        {
          "id": 1,
          "downloadLink": "https://api-stage.gosigner.com.br/file-download?name=1-09086f6084bb4eda42ace9ef69f25450027b9997.pdf"
        }
      ],
      "type": "http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html",
      "title": "Unknown",
      "status": 200,
      "detail": "Transaction fetched with success",
      "code": "TRANSACTION_FETCHED",
      "message": "Transaction fetched with success"
    });
    const files = payloadParser.getFiles();
    for (var i in files) {
        var file = files[i];
        console.log("File[" + file.id + "] = " + file.getSrc());
    }
}
catch(ex){
    console.error(ex)
}
```

## Example Usage

Here is an example of how to use the library:

```js
const {File,PayloadComposer,Ui,Security,SignatureSetting, PayloadParser} = require('js-gosigner-sdk');

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
    payloadComposer.setCallbackUrl("http://localhost:9000/response-sign?q=");
    payloadComposer.setWebhookUrl("https://webhook.site/38c373d8-92bc-41b3-9978-6c67aa89ad3b");

    // Configure UI settings
    const payloadUi = new Ui();
    // payloadUi.setUsername("04660457192"); // CPF or CNPJ
    payloadUi.setColor("#FFFF00");
    payloadUi.setScope("signature_session");
    payloadUi.setLifetime(60 * 60 * 24 * 7); // 7 days in seconds
    payloadUi.setPreferPreview("file");
    payloadComposer.setUi(payloadUi);

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
    payloadSecurity.setAllowEditLifetime(true);
    payloadSecurity.setAllowEditScope(true);

    //Allow return only code to download
    payloadSecurity.setPayloadCallbackUrl(false);
    payloadSecurity.setPayloadCodeCallbackUrl(true);
    
    //Allow return full payload on callback
    //payloadSecurity.setPayloadCallbackUrl(true);
    //payloadSecurity.setPayloadCodeCallbackUrl(false);

    //payloadSecurity.addProviderType("CLOUD"); //Default is LOCAL and CLOUD
    //payloadSecurity.addProviderType("LOCAL");
    payloadComposer.setSecurity(payloadSecurity);

    // Add the first file with its signature settings
    const file1 = new File();
    file1.setName("My file name sample 1");
    file1.setDescription("My file description sample 1");
    file1.setSrc("https://www.gemboxsoftware.com/pdf/examples/204/resources/Hello%20World.pdf");

    const file1SignatureSettings = new SignatureSetting();
    file1SignatureSettings.setType("DOC-pdf");
    file1SignatureSettings.setVisibleSignAppearanceConfig(1, 390, 10, 200, 28);
    file1.setSignatureSetting(file1SignatureSettings);
    payloadComposer.addFile(file1);

    // // Add the second file with its signature settings
    const file2 = new File();
    file2.setName("My file name sample 2");
    file2.setDescription("My file description sample 2");
    file2.setSrc("https://www.gemboxsoftware.com/pdf/examples/204/resources/Hello%20World.pdf");

    const file2SignatureSettings = new SignatureSetting();
    file2SignatureSettings.setType("DOC-pdf");
    file2SignatureSettings.setPolicy("PAdES-AD_RB");
    file2SignatureSettings.setVisibleSignatureCustomTemplateSrc("https://gestao-online-sites.s3.sa-east-1.amazonaws.com/gocrypto.com.br/assets/tests/template.html");
    file2SignatureSettings.setVisibleSignAppearanceConfig(1, 390, 300, 200, 28);
    file2.setSignatureSetting(file2SignatureSettings);
    payloadComposer.addFile(file2);

    // Generate payload data and token
    payloadData = payloadComposer.toJson();
    payloadToken = payloadComposer.generateToken();
    apiToken = payloadComposer.signForegroundLink(true);
    apiUiLinkWithToken = payloadComposer.signForegroundLink(false);

    //Get returns
    console.log({payloadData, payloadToken, apiToken, apiUiLinkWithToken});
} catch (ex) {
    // Handle exceptions and log error details
    errorMessage = ex.message;
    errorTrace = ex.stack;
    console.error({ errorMessage, errorTrace });
}
```