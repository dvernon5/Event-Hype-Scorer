FROM node:22.22.2-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install --production

COPY server/ .

COPY client/ /client

EXPOSE 8080

CMD ["node", "server.js"]