# --- 构建前端 ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- 运行服务 ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
# 只拿运行时需要的文件
COPY --from=build /app/build /app/build
COPY server /app/server
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 8080
CMD ["node", "server/index.js"]
