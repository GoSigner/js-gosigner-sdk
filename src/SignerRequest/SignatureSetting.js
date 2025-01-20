class SignatureSetting {
    constructor() {
        this.type = null;
        this.visibleSignImg = null;
        this.visibleSignPage = null;
        this.visibleSignX = null;
        this.visibleSignY = null;
        this.visibleSignWidth = null;
        this.visibleSignHeight = null;
        this.visibleSignatureCustomTemplateSrc = null;
        this.visibleSignatureDateFormat = null;
        this.visibleSignatureGeneratorName = null;
        this.visibleSignatureGeneratorDocument = null;
        this.visibleSignatureGeneratorFooter = null;
        this.visibleSignatureGeneratorHeader = null;
        this.visibleSignatureGeneratorMarkerSrc = null;
        this.visibleSignatureGeneratorBackgroundSrc = null;
        this.policy = null;
    }

    // List of allowed types
    static ALLOWED_TYPES = [
        'CFMBR-2.16.76.1.12.1.1', // Medication prescription
        'CFMBR-2.16.76.1.12.1.2', // Medical certificate
        'CFMBR-2.16.76.1.12.1.3', // Request for examination
        'CFMBR-2.16.76.1.12.1.4', // Laboratory report
        'CFMBR-2.16.76.1.12.1.5', // Discharge summary
        'CFMBR-2.16.76.1.12.1.6', // Clinical attendance record
        'CFMBR-2.16.76.1.12.1.7', // Medication dispensing
        'CFMBR-2.16.76.1.12.1.8', // Vaccination
        'CFMBR-2.16.76.1.12.1.11', // Medical report
        'DOC-pdf',                // Other PDF files
        'hash'                    // Hash for CMS signature
    ];

    // List of allowed policies
    static ALLOWED_POLICIES = [
        'CAdES-AD_RB',  // CAdES policy
        'CAdES-AD_RT',  // CAdES policy with timestamp
        'PAdES-AD_RB',  // PAdES policy
        'PAdES-AD_RT',  // PAdES policy with timestamp
        ''              // Allows empty value
    ];

    // Getters e setters
    getType() {
        return this.type;
    }

    setType(type) {
        if (!SignatureSetting.ALLOWED_TYPES.includes(type)) {
            throw new Error(`Invalid signature type: ${type}`);
        }
        this.type = type;
    }

    getPolicy() {
        return this.policy;
    }

    setPolicy(policy) {
        if (!SignatureSetting.ALLOWED_POLICIES.includes(policy)) {
            throw new Error(`Invalid signature policy: ${policy}`);
        }
        this.policy = policy;
    }

    getVisibleSignImg() {
        return this.visibleSignImg;
    }

    setVisibleSignImg(visibleSignImg) {
        this.visibleSignImg = visibleSignImg;
    }

    getVisibleSignPage() {
        return this.visibleSignPage;
    }

    setVisibleSignPage(visibleSignPage) {
        this.visibleSignPage = visibleSignPage;
    }

    getVisibleSignX() {
        return this.visibleSignX;
    }

    setVisibleSignX(visibleSignX) {
        this.visibleSignX = visibleSignX;
    }

    getVisibleSignY() {
        return this.visibleSignY;
    }

    setVisibleSignY(visibleSignY) {
        this.visibleSignY = visibleSignY;
    }

    getVisibleSignWidth() {
        return this.visibleSignWidth;
    }

    setVisibleSignWidth(visibleSignWidth) {
        this.visibleSignWidth = visibleSignWidth;
    }

    getVisibleSignHeight() {
        return this.visibleSignHeight;
    }

    setVisibleSignHeight(visibleSignHeight) {
        this.visibleSignHeight = visibleSignHeight;
    }

    setVisibleSignAppearanceConfig(page, x, y, width, height) {
        this.visibleSignPage = page;
        this.visibleSignX = x;
        this.visibleSignY = y;
        this.visibleSignWidth = width;
        this.visibleSignHeight = height;
    }

    getVisibleSignatureCustomTemplateSrc() {
        return this.visibleSignatureCustomTemplateSrc;
    }

    setVisibleSignatureCustomTemplateSrc(src) {
        this.visibleSignatureCustomTemplateSrc = src;
    }

    getVisibleSignatureDateFormat() {
        return this.visibleSignatureDateFormat;
    }

    setVisibleSignatureDateFormat(format) {
        this.visibleSignatureDateFormat = format;
    }

    getVisibleSignatureGeneratorName() {
        return this.visibleSignatureGeneratorName;
    }

    setVisibleSignatureGeneratorName(name) {
        this.visibleSignatureGeneratorName = name;
    }

    getVisibleSignatureGeneratorDocument() {
        return this.visibleSignatureGeneratorDocument;
    }

    setVisibleSignatureGeneratorDocument(document) {
        this.visibleSignatureGeneratorDocument = document;
    }

    getVisibleSignatureGeneratorFooter() {
        return this.visibleSignatureGeneratorFooter;
    }

    setVisibleSignatureGeneratorFooter(footer) {
        this.visibleSignatureGeneratorFooter = footer;
    }

    getVisibleSignatureGeneratorHeader() {
        return this.visibleSignatureGeneratorHeader;
    }

    setVisibleSignatureGeneratorHeader(header) {
        this.visibleSignatureGeneratorHeader = header;
    }

    getVisibleSignatureGeneratorMarkerSrc() {
        return this.visibleSignatureGeneratorMarkerSrc;
    }

    setVisibleSignatureGeneratorMarkerSrc(src) {
        this.visibleSignatureGeneratorMarkerSrc = src;
    }

    getVisibleSignatureGeneratorBackgroundSrc() {
        return this.visibleSignatureGeneratorBackgroundSrc;
    }

    setVisibleSignatureGeneratorBackgroundSrc(src) {
        this.visibleSignatureGeneratorBackgroundSrc = src;
    }

    toArray() {
        const properties = [
            'type',
            'policy',
            'visibleSignImg',
            'visibleSignPage',
            'visibleSignX',
            'visibleSignY',
            'visibleSignWidth',
            'visibleSignHeight',
            'visibleSignatureCustomTemplateSrc',
            'visibleSignatureDateFormat',
            'visibleSignatureGeneratorName',
            'visibleSignatureGeneratorDocument',
            'visibleSignatureGeneratorFooter',
            'visibleSignatureGeneratorHeader',
            'visibleSignatureGeneratorMarkerSrc',
            'visibleSignatureGeneratorBackgroundSrc'
        ];

        return properties.reduce((obj, prop) => {
            if (this[prop] !== null) {
                obj[prop] = this[prop];
            }
            return obj;
        }, {});
    }
}

module.exports = SignatureSetting;
