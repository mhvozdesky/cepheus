FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install http-proxy-middleware --save

COPY . .

CMD npm start