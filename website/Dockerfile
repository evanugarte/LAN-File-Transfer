FROM node:14-alpine as builder

WORKDIR /frontend

COPY package.json ./

COPY package-lock.json ./

RUN npm install --production

COPY . ./

RUN npm run build --production

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
