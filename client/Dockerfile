# client/Dockerfile
FROM node:18-alpine
#ARG REACT_APP_SOCKET_SERVER_URL
#ENV REACT_APP_SOCKET_SERVER_URL $REACT_APP_SOCKET_SERVER_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "run", "start:client"]
