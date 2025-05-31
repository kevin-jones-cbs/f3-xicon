# Step 1: Build
FROM node:22-alpine AS builder

WORKDIR /app
COPY . .

# Install dependencies using Yarn
RUN corepack enable && yarn install
RUN yarn build

# Step 2: Run
FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 8080

CMD ["yarn", "start", "-p", "8080"]
