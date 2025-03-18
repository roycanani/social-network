FROM node:18-alpine as build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package*.json ./
COPY pnpm-lock.yaml* ./
RUN pnpm install

# Copy application code and build
COPY . .
RUN pnpm run build

# Production environment
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]