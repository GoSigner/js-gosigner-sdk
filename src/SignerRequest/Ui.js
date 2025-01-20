class Ui {

    constructor() {
        this.name = null; // Only for electronic provider
        this.email = null; // Only for electronic provider
        this.cellphone = null; // Only for electronic provider
        this.username = null;
        this.scope = null;
        this.lifetime = null;
        this.button = null;
        this.bg = null;
        this.color = null;
        this.callback = null;
        this.preferPreview = null;
    }

    // List of allowed scopes
    static ALLOWED_SCOPES = [
        'single_signature',
        'multi_signature',
        'signature_session',
    ];

    // Getters e setters
    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getCellphone() {
        return this.cellphone;
    }

    setCellphone(cellphone) {
        this.cellphone = cellphone;
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        if (!/^\d{11}$|^\d{14}$/.test(username)) {
            throw new Error(
                'Username must be a valid CPF (11 digits) or CNPJ (14 digits).'
            );
        }
        this.username = username;
    }

    getScope() {
        return this.scope;
    }

    setScope(scope) {
        if (!Ui.ALLOWED_SCOPES.includes(scope)) {
            throw new Error(
                `Invalid scope: ${scope}. Allowed values are: ${Ui.ALLOWED_SCOPES.join(
                    ', '
                )}.`
            );
        }
        this.scope = scope;
    }

    getLifetime() {
        return this.lifetime;
    }

    setLifetime(lifetime) {
        if (lifetime <= 0) {
            throw new Error('Lifetime must be greater than zero.');
        }
        this.lifetime = lifetime;
    }

    getButton() {
        return this.button;
    }

    setButton(button) {
        this.button = button;
    }

    getBg() {
        return this.bg;
    }

    setBg(bg) {
        if (!/^#[0-9a-fA-F]{6}$/.test(bg)) {
            throw new Error('Background color must be in hexadecimal format.');
        }
        this.bg = bg;
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
            throw new Error('Color must be in hexadecimal format.');
        }
        this.color = color;
    }

    getCallback() {
        return this.callback;
    }

    setCallback(callback) {
        try {
            new URL(callback);
        } catch {
            throw new Error('Callback must be a valid URL.');
        }
        this.callback = callback;
    }

    getPreferPreview() {
        return this.preferPreview;
    }

    setPreferPreview(preferPreview) {
        if (!['file', 'description'].includes(preferPreview)) {
            throw new Error("preferPreview must be either 'file' or 'description'.");
        }
        this.preferPreview = preferPreview;
    }

    // Method to convert the object to an array/object
    toArray() {
        const properties = [
            'name',
            'email',
            'cellphone',
            'username',
            'scope',
            'lifetime',
            'button',
            'bg',
            'color',
            'callback',
            'preferPreview',
        ];

        return properties.reduce((obj, prop) => {
            if (this[prop] !== null) {
                obj[prop] = this[prop];
            }
            return obj;
        }, {});
    }
}

module.exports = Ui;
