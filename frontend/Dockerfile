FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

# Declare the build argument for the frontend
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

# Inject the env value to the .env file
RUN echo "VITE_API_URL=$VITE_API_URL" > .env

# Build the frontend
RUN npm run build

# Serve the static files using a minimal HTTP server
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist"]
