FROM node:6.9

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"
ENV DOCKER=true

RUN curl "https://install.meteor.com/" | sh

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN mkdir /meteor_uploads

RUN chmod -R 700 /usr/src/app/.meteor/local
RUN meteor npm install

EXPOSE 3000
CMD ["npm", "start", "--production"]
