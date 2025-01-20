class Security {
    constructor() {
        this.allowAddNewDocument = null;
        this.allowChangeUsername = null;
        this.allowAutocontinue = null;
        this.allowChangeName = null;
        this.allowChangeEmail = null;
        this.allowChangeCellphone = null;
        this.allowDocumentType = null;
        this.payloadCallbackUrl = null;
        this.payloadCodeCallbackUrl = null;
        this.allowEditScope = null;
        this.allowEditLifetime = null;
        this.providerType = [];
        this.providerMfa = [];
    }

    static ALLOWED_PROVIDER_TYPE = ['CLOUD', 'LOCAL', 'ELETRONIC'];
    static ALLOWED_PROVIDER_MFA = ['geoLocation', 'email', 'cellphone'];

    // Getters and Setters
    getAllowAddNewDocument() {
        return this.allowAddNewDocument;
    }

    setAllowAddNewDocument(value) {
        this.allowAddNewDocument = value;
    }

    getAllowChangeUsername() {
        return this.allowChangeUsername;
    }

    setAllowChangeUsername(value) {
        this.allowChangeUsername = value;
    }

    getAllowAutocontinue() {
        return this.allowAutocontinue;
    }

    setAllowAutocontinue(value) {
        this.allowAutocontinue = value;
    }

    getAllowChangeName() {
        return this.allowChangeName;
    }

    setAllowChangeName(value) {
        this.allowChangeName = value;
    }

    getAllowChangeEmail() {
        return this.allowChangeEmail;
    }

    setAllowChangeEmail(value) {
        this.allowChangeEmail = value;
    }

    getAllowChangeCellphone() {
        return this.allowChangeCellphone;
    }

    setAllowChangeCellphone(value) {
        this.allowChangeCellphone = value;
    }

    getAllowDocumentType() {
        return this.allowDocumentType;
    }

    setAllowDocumentType(value) {
        this.allowDocumentType = value;
    }

    getPayloadCallbackUrl() {
        return this.payloadCallbackUrl;
    }

    setPayloadCallbackUrl(value) {
        this.payloadCallbackUrl = value;
    }

    getPayloadCodeCallbackUrl() {
        return this.payloadCodeCallbackUrl;
    }

    setPayloadCodeCallbackUrl(value) {
        this.payloadCodeCallbackUrl = value;
    }

    getAllowEditScope() {
        return this.allowEditScope;
    }

    setAllowEditScope(value) {
        this.allowEditScope = value;
    }

    getAllowEditLifetime() {
        return this.allowEditLifetime;
    }

    setAllowEditLifetime(value) {
        this.allowEditLifetime = value;
    }

    getProviderType() {
        return this.providerType;
    }

    setProviderType(providerType) {
        providerType.forEach(item => {
            if (!Security.ALLOWED_PROVIDER_TYPE.includes(item)) {
                throw new Error(`Invalid providerType: ${item}. Allowed values are: ${Security.ALLOWED_PROVIDER_TYPE.join(', ')}.`);
            }
        });
        this.providerType = providerType;
    }

    addProviderType(providerType) {
        if (!Security.ALLOWED_PROVIDER_TYPE.includes(providerType)) {
            throw new Error(`Invalid providerType: ${providerType}. Allowed values are: ${Security.ALLOWED_PROVIDER_TYPE.join(', ')}.`);
        }
        this.providerType.push(providerType);
    }

    getProviderMfa() {
        return this.providerMfa;
    }

    setProviderMfa(providerMfa) {
        providerMfa.forEach(item => {
            if (!Security.ALLOWED_PROVIDER_MFA.includes(item)) {
                throw new Error(`Invalid providerMfa: ${item}. Allowed values are: ${Security.ALLOWED_PROVIDER_MFA.join(', ')}.`);
            }
        });
        this.providerMfa = providerMfa;
    }

    addProviderMfa(providerMfa) {
        if (!Security.ALLOWED_PROVIDER_MFA.includes(providerMfa)) {
            throw new Error(`Invalid providerMfa: ${providerMfa}. Allowed values are: ${Security.ALLOWED_PROVIDER_MFA.join(', ')}.`);
        }
        this.providerMfa.push(providerMfa);
    }

    // Convert the Security object into an object
    toArray() {
        const data = {
            allowAddNewDocument: this.allowAddNewDocument,
            allowAutocontinue: this.allowAutocontinue,
            allowChangeUsername: this.allowChangeUsername,
            allowChangeName: this.allowChangeName,
            allowChangeEmail: this.allowChangeEmail,
            allowChangeCellphone: this.allowChangeCellphone,
            allowDocumentType: this.allowDocumentType,
            payloadCallbackUrl: this.payloadCallbackUrl,
            payloadCodeCallbackUrl: this.payloadCodeCallbackUrl,
            allowEditScope: this.allowEditScope,
            allowEditLifetime: this.allowEditLifetime,
            providerType: this.providerType.length ? this.providerType : undefined,
            providerMfa: this.providerMfa.length ? this.providerMfa : undefined,
        };

        // Remove undefined properties
        return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
    }
}

module.exports = Security;
