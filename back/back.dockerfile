FROM node:lts-alpine

COPY . /app

WORKDIR /app

# RUN yarn global add @nestjs/cli 

EXPOSE 4000
EXPOSE 5555

ENTRYPOINT [ "/bin/sh", "-c", "npx prisma migrate deploy && yarn run start" ]
