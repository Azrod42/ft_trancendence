FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN apk update && apk upgrade

EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "-c", "yarn install --non-interactive && yarn build && yarn start" ]
