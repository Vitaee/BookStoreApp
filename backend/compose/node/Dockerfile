FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000-3002

# Start the app when the container starts
CMD ["npm", "run", "start:dev"]