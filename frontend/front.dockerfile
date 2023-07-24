FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN apk update && apk upgrade

EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "-c", "yarn add next && yarn build && yarn start" ]
