FROM node:lts-alpine

COPY . /app

WORKDIR /app

RUN apk update && apk upgrade

EXPOSE 4000

# ENTRYPOINT [ "/bin/sh", "-c", "npx prisma migrate deploy && yarn run start" ]
ENTRYPOINT [ "/bin/sh", "-c", "yarn install --non-interactive && yarn add @nestjs/cli && npx prisma migrate deploy && yarn run start" ]
