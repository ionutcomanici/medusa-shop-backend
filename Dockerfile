FROM node:20-alpine

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 9000

CMD ["sh", "-c", "cd /app && npx medusa db:migrate && cd /app/.medusa/server && npx medusa start"]
