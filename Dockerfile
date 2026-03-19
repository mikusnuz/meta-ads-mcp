FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod
COPY dist/ ./dist/
ENTRYPOINT ["node", "dist/index.js"]
