FROM node:alpine

WORKDIR /api_gateway

COPY package.json .

COPY package-lock.json .

RUN npm install --production

COPY src/ src/

COPY main.js .

EXPOSE 5000

CMD ["npm", "run", "start"]
