FROM node:alpine

WORKDIR /logging_service

COPY package.json .

COPY package-lock.json .

RUN npm install --production

COPY src/ src/

COPY models/ models/

COPY main.js .

EXPOSE 5002

CMD ["npm", "run", "start"]
