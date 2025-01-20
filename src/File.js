const axios = require('axios'); // To handle HTTP requests

class File {
    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
        this.src = null;
        this.signatureSetting = null;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }

    getSrc() {
        return this.src;
    }

    setSrc(src) {
        this.src = src;
    }

    getSignatureSetting() {
        return this.signatureSetting;
    }

    setSignatureSetting(signatureSetting) {
        this.signatureSetting = signatureSetting;
    }

    async getBytes() {
        if (this.src.startsWith('data:')) {
            // Handle RFC 2397 data URI
            const parts = this.src.split(',', 2);

            if (parts.length !== 2) {
                throw new Error('Invalid data URI format');
            }

            const metadata = parts[0];
            const data = parts[1];

            // Check if the data is base64 encoded
            if (metadata.includes('base64')) {
                const decodedData = Buffer.from(data, 'base64');
                if (!decodedData) {
                    throw new Error('Failed to decode base64 data');
                }
                return decodedData;
            }

            // Otherwise, return raw data (percent-decoded)
            return decodeURIComponent(data);
        } else if (this.isValidUrl(this.src)) {
            // Validate URL and perform secure HTTP GET request
            try {
                const response = await axios.get(this.src, {
                    headers: {
                        'User-Agent': 'GoSignerFileDownloader/1.0'
                    },
                    timeout: 5000
                });

                return response.data;
            } catch (error) {
                throw new Error('Failed to download file from URL');
            }
        } else {
            throw new Error('Invalid src format');
        }
    }

    isValidUrl(url) {
        // Simples validação de URL
        const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return regex.test(url);
    }

    toArray() {
        const data = {};
        const properties = ['id', 'name', 'description', 'src', 'signatureSetting'];

        // Iterate through properties and add to array if not empty
        properties.forEach((property) => {
            const value = this[property];

            // Check if the property is not null before adding to the array
            if (value !== null && value !== undefined) {
                // Check if the property is an object (like signatureSetting) and convert to array if so
                data[property] = value instanceof Object ? value.toArray() : value;
            }
        });

        return data;
    }
}

module.exports = File;
