# Stage 1: Builder – full install + medusa build (includes admin React app)
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Fail the build immediately if the admin wasn't compiled
RUN test -f .medusa/server/public/admin/index.html \
    && echo "Admin build OK" \
    || (echo "ERROR: Admin build failed – index.html missing" && exit 1)

# Stage 2: Runner – production deps only, copy compiled output
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --legacy-peer-deps --omit=dev

# Copy the entire .medusa/ dir (compiled server + admin static files)
COPY --from=builder /app/.medusa ./.medusa

EXPOSE 9000

# Run both migrate AND start from .medusa/server so rootDirectory is correct
# and Medusa finds the admin at .medusa/server/public/admin/index.html
CMD ["sh", "-c", "cd /app/.medusa/server && /app/node_modules/.bin/medusa db:migrate && /app/node_modules/.bin/medusa start"]
