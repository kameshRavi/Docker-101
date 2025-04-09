FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG PORT=8080
ENV PORT=$PORT
ENV HOSTNAME="0.0.0.0"


EXPOSE $PORT
CMD ["node", "server.js"]
