# Build Stage
FROM node:20-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# pnpm version
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Declare the build argument for the frontend
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Inject the env value to the .env file
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

# Copy the full app
COPY . .

# Build the production-ready static site
RUN pnpm run build


# Runtime Stage (Static Server)
FROM node:20-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# pnpm version and install `serve`
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate
RUN pnpm add -g serve


WORKDIR /app

# Copy built files 
COPY --from=builder /app/dist ./dist

# Default serve on port 3000
EXPOSE 3000

CMD ["serve", "-s", "dist"]
