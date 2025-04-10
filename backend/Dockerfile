# Build Stage
FROM node:20-alpine AS builder

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source files
COPY server.js ./
COPY data ./data

# Runtime Stage
FROM node:20-alpine

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Create app directory
WORKDIR /app

# Copy only production-ready build from builder stage
COPY --from=builder /app /app


ARG PORT=8080
ENV PORT=$PORT
ENV HOSTNAME="0.0.0.0"
# Expose port
EXPOSE $PORT

# Start app
CMD ["node", "server.js"]
