# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN #npm run build # Si ton serveur a besoin d'être build

EXPOSE 3000
CMD ["npm", "run", "start:server"]
