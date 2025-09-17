FROM node:20.11.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev"]