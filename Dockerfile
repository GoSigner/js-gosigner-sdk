# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy project files
COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
