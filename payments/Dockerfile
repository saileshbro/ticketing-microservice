FROM node:21.7.3-alpine3.18
WORKDIR /app
COPY package.json .
RUN yarn --prod --force
COPY . .
CMD ["yarn","start"]
