FROM node:18-alpine

WORKDIR /app

# Install build dependencies for bcrypt and other native modules
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies 
RUN pnpm install

# Copy application code
COPY . .

# Build TypeScript code
RUN pnpm run build

# Rebuild bcrypt specifically to ensure it's properly compiled
RUN cd node_modules/bcrypt && npm rebuild bcrypt --build-from-source

# Set environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["pnpm", "start"]