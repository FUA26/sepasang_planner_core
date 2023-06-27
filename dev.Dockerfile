FROM node:16 AS builder

WORKDIR /app

# Copy package files and dependencies
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy rest of the code
COPY . .

CMD [ "npm", "run", "start:dev" ]