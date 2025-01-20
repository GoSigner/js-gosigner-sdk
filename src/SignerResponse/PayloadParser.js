const axios = require('axios');
const File = require('../File');
const PayloadAbstract = require('../PayloadAbstract');

class PayloadParser extends PayloadAbstract {
    constructor() {
        super();
        this.payloadData = null;
    }

    setPayloadData(payloadData) {
        this.payloadData = payloadData;
    }

    getPayloadData() {
        return this.payloadData;
    }

    getFiles() {
        const files = [];
        if (this.payloadData && this.payloadData.documents) {
            this.payloadData.documents.forEach((document) => {
                const file = new File();
                file.setId(document.id);
                file.setSrc(document.downloadLink);
                files.push(file);
            });
        }
        return files;
    }

    getPayloadCode() {
        if (this.payloadData && this.payloadData.payloadCode) {
            return this.payloadData.payloadCode;
        }
        return null;
    }

    getPayloadTokenSession() {
        if (this.payloadData && this.payloadData.token) {
            return this.payloadData.token;
        }
        return null;
    }

    getPayloadSelectedCertificateSession() {
        if (this.payloadData && this.payloadData.selectedCertificate) {
            return this.payloadData.selectedCertificate;
        }
        return null;
    }

    getDocuments() {
        return this.getFiles(); // @DEPRECATED
    }

    async findByToken(token) {
        const baseUrl = this.getBaseUrl();
        const url = `${baseUrl}/transaction-payload/${token}`;

        try {
           // Performing the HTTP GET request
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json'
                },
                timeout: 60000, // 60 second timeout
            });

            const responseData = response.data;

            switch (responseData.code) {
                case "SIGNED_OK":
                case "SIGNED_OK_LOCAL":
                case "TRANSACTION_FETCHED":
                    this.payloadData = responseData;
                    return true;
                default:
                    throw new Error(`Failed to retrieve payload by token, error: ${responseData.code}`);
            }
        } catch (error) {
            // Errors in the request
            throw new Error(`Failed to make HTTP request to ${url}, error: ${error.message}`);
        }
    }
}

module.exports = PayloadParser;
