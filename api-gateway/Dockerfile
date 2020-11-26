FROM node:alpine

WORKDIR /api_gateway

COPY package.json .

COPY package-lock.json .

RUN npm install --production

COPY src/ src/

COPY main.js .

EXPOSE 5000

ENV CPP_SERVICE_URL "http://lft-file-api:5001"

ENV NODE_SERVICE_URL "http://lft-logging-api:5002"

CMD ["npm", "run", "start"]
