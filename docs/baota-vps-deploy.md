# `dailyhotapi-rww` 宝塔 VPS 部署说明

> 适用场景：单台 VPS、宝塔面板维护、固定域名提供 API 给下游调用  
> 推荐域名：`hotapi.ricktung.com`

---

## 1. 部署目标

部署完成后，推荐对外提供：

- 控制台：`https://hotapi.ricktung.com/radar`
- 新接口：`https://hotapi.ricktung.com/api/radar/*`
- 兼容接口：`https://hotapi.ricktung.com/:sourceId`

本项目当前推荐的生产架构：

- 宝塔面板管理 `Nginx`、域名、SSL、站点日志
- `PM2` 管理 Node 进程
- 项目自身监听本机 `6688`
- `Nginx` 反向代理到 `127.0.0.1:6688`

---

## 2. 服务器准备

推荐环境：

- Ubuntu 22.04 / 24.04 LTS
- 宝塔最新版
- Node.js 20+
- `pnpm`
- `Git`
- `PM2`

项目要求的 Node 版本为：

- `>=20`

参考：

- [package.json](/Users/rick/Agent/dailyhotapi-rww/package.json#L74)

防火墙建议只开放：

- `22`
- `80`
- `443`

不要对公网开放：

- `6688`

---

## 3. 宝塔软件安装

在宝塔中至少安装：

- `Nginx`
- `PM2 管理器` 或 Node 运行环境
- `Git`

可选安装：

- `Redis`

说明：

- MVP 阶段不装 Redis 也能跑
- 如果后续要更稳的缓存或多实例，再补 Redis

---

## 4. 目录规划

推荐目录：

```bash
/www/wwwroot/apps/dailyhotapi-rww
/www/wwwroot/apps/dailyhotapi-rww/logs
/www/wwwroot/sites/hotapi.ricktung.com
```

说明：

- `apps/dailyhotapi-rww`：代码与运行目录
- `sites/hotapi.ricktung.com`：宝塔站点目录占位

---

## 5. 拉代码并安装依赖

```bash
cd /www/wwwroot/apps
git clone https://github.com/Gogoworks/dailyhotapi-rww.git
cd dailyhotapi-rww
npm i -g pnpm
pnpm install --frozen-lockfile
mkdir -p logs
```

---

## 6. 环境变量配置

复制并编辑 `.env`：

```bash
cp .env.example .env
```

推荐 `.env`：

```env
PORT=6688
ALLOWED_DOMAIN="https://hotapi.ricktung.com"
ALLOWED_HOST="ricktung.com"
DISALLOW_ROBOT=true

REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_DB=0

CACHE_TTL=3600
REQUEST_TIMEOUT=6000
USE_LOG_FILE=true
RSS_MODE=false
FILTER_WEIBO_ADVERTISEMENT=false
```

如果暂时不启用 Redis，保留默认值即可。

---

## 7. 构建

```bash
cd /www/wwwroot/apps/dailyhotapi-rww
pnpm build
```

当前项目已经改成真正适合生产的启动方式：

- 主入口执行时自动启动服务
- `pnpm start` 默认使用 `NODE_ENV=production`

---

## 8. 使用 PM2 启动

仓库已提供可直接用于 VPS 的：

- [ecosystem.server.cjs](/Users/rick/Agent/dailyhotapi-rww/ecosystem.server.cjs)

使用前请确认其中的 `cwd` 和日志目录与你服务器一致。

启动命令：

```bash
cd /www/wwwroot/apps/dailyhotapi-rww
pm2 start ecosystem.server.cjs
pm2 save
pm2 startup
```

日常运维命令：

```bash
pm2 status
pm2 logs dailyhotapi-rww
pm2 restart dailyhotapi-rww
pm2 reload ecosystem.server.cjs --only dailyhotapi-rww
pm2 stop dailyhotapi-rww
```

---

## 9. 宝塔站点与反向代理

### 9.1 创建站点

在宝塔添加站点：

- 域名：`hotapi.ricktung.com`
- 根目录：`/www/wwwroot/sites/hotapi.ricktung.com`

不需要数据库，不需要 PHP。

### 9.2 反向代理

在站点设置中添加反向代理：

- 代理名称：`dailyhotapi-rww`
- 目标 URL：`http://127.0.0.1:6688`
- 发送域名：`$host`

核心 Nginx 逻辑应类似：

```nginx
location / {
    proxy_pass http://127.0.0.1:6688;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 10. SSL

在宝塔站点 SSL 中：

1. 申请 `Let's Encrypt`
2. 域名填 `hotapi.ricktung.com`
3. 申请成功后开启强制 HTTPS

MVP 阶段不建议一开始就折腾通配符证书。

单域名最稳。

---

## 11. 首次验收

部署完成后至少执行：

```bash
curl -I https://hotapi.ricktung.com
curl https://hotapi.ricktung.com/api/radar/health
curl https://hotapi.ricktung.com/api/radar/sources
curl https://hotapi.ricktung.com/api/radar/scan/weibo
```

浏览器验收：

- `https://hotapi.ricktung.com/`
- `https://hotapi.ricktung.com/radar`

---

## 12. 本地迭代后如何升级 VPS 版本

推荐先采用“手动触发、可回滚”的升级方式。

### 12.1 本地流程

1. 本地开发
2. 本地运行：
   - `pnpm test`
   - `pnpm lint`
   - `pnpm build`
3. 提交并 push 到 GitHub

### 12.2 VPS 升级流程

```bash
cd /www/wwwroot/apps/dailyhotapi-rww
git fetch origin
git checkout master
git pull --ff-only origin master
pnpm install --frozen-lockfile
pnpm build
pm2 reload ecosystem.server.cjs --only dailyhotapi-rww || pm2 start ecosystem.server.cjs --only dailyhotapi-rww
pm2 save
```

### 12.3 推荐做成服务器脚本

你可以在服务器上创建：

```bash
/www/wwwroot/apps/dailyhotapi-rww/deploy.sh
```

内容：

```bash
#!/usr/bin/env bash
set -e

cd /www/wwwroot/apps/dailyhotapi-rww
git fetch origin
git checkout master
git pull --ff-only origin master
pnpm install --frozen-lockfile
pnpm build
pm2 reload ecosystem.server.cjs --only dailyhotapi-rww || pm2 start ecosystem.server.cjs --only dailyhotapi-rww
pm2 save
```

赋权：

```bash
chmod +x /www/wwwroot/apps/dailyhotapi-rww/deploy.sh
```

以后升级只需执行：

```bash
cd /www/wwwroot/apps/dailyhotapi-rww
./deploy.sh
```

---

## 13. 回滚方案

如果升级后异常：

```bash
cd /www/wwwroot/apps/dailyhotapi-rww
git log --oneline -5
git checkout <稳定提交ID>
pnpm install --frozen-lockfile
pnpm build
pm2 reload ecosystem.server.cjs --only dailyhotapi-rww
pm2 save
```

---

## 14. 其他补充说明

### 14.1 当前建议单实例

当前项目有进程内缓存（NodeCache）。

因此 MVP 阶段建议：

- `PM2 instances = 1`

原因：

- 多实例下，每个实例会各自持有一份内存缓存
- 会造成缓存命中与过期时间不完全一致

### 14.2 Redis 何时再上

如果你后面需要：

- 更稳的缓存
- 重启后缓存保留
- 多实例

再启用 Redis 即可。

### 14.3 域名建议

对下游固定提供一个基地址即可：

- `https://hotapi.ricktung.com`

不要让下游依赖临时端口或服务器 IP。

### 14.4 最终推荐

当前最适合你的生产方案是：

- 宝塔管 `Nginx + SSL + 域名`
- PM2 管 Node 进程
- 项目监听 `127.0.0.1:6688`
- 下游固定调用 `https://hotapi.ricktung.com/api/radar/*`
- 发布时 VPS 手动执行 `deploy.sh`

这套方案对 MVP 来说最稳，维护成本最低，也最适合宝塔面板运维。
