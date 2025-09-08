# Binance MCP Server Docker镜像构建文件
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY tsconfig.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY src ./src
COPY scripts ./scripts

# 构建TypeScript
RUN npm run build

# 生产环境镜像
FROM node:20-alpine AS production

# 设置非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S binance -u 1001

# 安装系统依赖
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    tini

# 设置工作目录
WORKDIR /app

# 复制package文件和构建结果
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/scripts ./scripts

# 安装生产依赖
RUN npm ci --only=production && \
    npm cache clean --force

# 设置权限
RUN chown -R binance:nodejs /app
USER binance

# 设置环境变量
ENV NODE_ENV=production
ENV SERVER_MODE=http
ENV PORT=3000
ENV HOST=0.0.0.0
ENV LOG_LEVEL=info

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
        const options = { hostname: '${HOST}', port: ${PORT}, path: '/message', timeout: 5000 }; \
        const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); \
        req.on('error', () => process.exit(1)); \
        req.end();"

# 暴露端口
EXPOSE ${PORT}

# 使用tini作为init进程，确保信号处理正确
ENTRYPOINT ["/sbin/tini", "--"]

# 启动命令
CMD ["node", "scripts/start-http-server.js"]