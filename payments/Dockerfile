FROM node:alpine
WORKDIR /app
COPY package.json .
RUN yarn --prod --force
COPY . .
CMD ["yarn","start"]
