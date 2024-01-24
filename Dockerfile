FROM node:16.14.0-alpine as builder

COPY . ./app
WORKDIR /app
RUN npm i -g pnpm
RUN pnpm install


CMD ["pnpm start:prod"]
