# 1. Base Node image
FROM node:22-alpine AS base
WORKDIR /app

# 2. Install dependencies (Cache the npm registry to speed up installs)
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 3. Build the Astro project
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Mount a cache directly into Astro's build cache directory to keep previously optimized images and build artifacts intact across deployments.
RUN --mount=type=cache,target=/app/node_modules/.astro \
    npm run build

# 4. Production web server (Nginx)
FROM nginx:alpine AS runner

# Copy the built static files from Astro to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration (make sure this file exists in your repo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]