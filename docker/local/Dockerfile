FROM node:18-bookworm-slim

RUN apt-get -y update \
    && apt-get -y upgrade \
    && apt-get -y install openssl ca-certificates curl

ENV NODE_ENV development

ENV TZ Asia/Tokyo

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD [ "npm", "run", "start:dev" ]
