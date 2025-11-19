FROM node:20-alpine

WORKDIR /app

# Copia só package.json e instala deps
COPY package.json ./
RUN npm install --only=production

# Copia o resto (server.cjs)
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
