# `dailyhotapi-rww`

一个独立、稳定、可消费的热榜 API 服务。

它的职责不是做内容平台，也不是做选题判断，而是把不同平台的热榜、热点、趋势数据整理成统一、可拉取、可归一、可追溯的接口输出，供下游系统直接消费。

---

## 1. 项目定位

当前仓库的定位已经明确收敛为：

- 独立热榜 API 服务
- 统一数据出口
- 面向机器消费的源聚合层
- 可被前端、脚本、定时任务、数据库入库任务、内容雷达系统直接接入

这个项目负责：

- 拉取上游热榜源
- 归一基础字段
- 暴露稳定 API
- 返回缓存、时间、状态、错误等元数据
- 提供轻量浏览控制台，方便人工核对和运营使用

这个项目不负责：

- 选题判断
- 事实核验
- 研究、写作、发布
- 为某个固定下游写死业务规则

---

## 2. 我们已经完成的关键工作

本仓库已经从上游聚合 API 形态，推进成了更适合当前项目目标的版本。关键工作包括：

### 2.1 新增独立命名空间 `/api/radar/*`

当前新下游推荐统一接入：

- `GET /api/radar/health`
- `GET /api/radar/sources`
- `GET /api/radar/scan/:sourceId`

这套接口具备：

- 统一 JSON 成功包
- 统一 JSON 错误包
- 源级元数据
- 条目级归一字段
- 适合机器消费的稳定结构

### 2.2 保留旧公共路由兼容

旧接口仍然保留：

- `GET /all`
- `GET /:sourceId`

所以现有依赖旧路由的系统不会被立刻破坏，但新系统不建议继续以旧契约为主。

### 2.3 新增前端控制台 `/radar`

当前内置前端已经不再只是一个落地页，而是具备实际操作价值的控制台，支持：

- 浏览源列表
- 搜索源
- 查看源状态
- 查看失败源
- 批量刷新
- 查看扫描结果
- 查看源级元数据
- 复制单条 `raw JSON`

### 2.4 生产启动方式已修正

项目已经修复了“必须依赖 `NODE_ENV=development` 才能启动”的问题。

当前生产启动结构是：

- `src/index.ts`：只导出服务
- `src/server.ts`：真正启动服务
- `pnpm start`：执行 `dist/server.js`

这一步是为了适配宝塔 PM2 项目这类托管方式，避免出现 “PM2 online，但端口没监听” 的假启动状态。

### 2.5 源状态治理

对不可稳定抓取的源进行了处理：

- `producthunt` 已修复，改走官方 feed
- `coolapk` 暂时下线
- `earthquake` 暂时下线
- `lol` 暂时下线

这样做的目的不是追求“源越多越好”，而是优先保证：

- 可用性
- 契约稳定
- 下游可消费

---

## 3. 当前项目结构

核心目录说明：

- `src/routes/`
  每个热榜源一个独立 route 模块
- `src/lib/`
  新增的共享能力层，包括：
  - 源注册与加载
  - radar 归一化
  - JSON 响应包装
- `src/views/`
  内置前端页面与控制台
- `test/`
  当前最小回归测试集
- `docs/downstream-api.md`
  面向下游的接口文档
- `docs/baota-vps-deploy.md`
  面向 VPS/宝塔部署的文档
- `scripts/deploy-vps.sh`
  VPS 更新脚本

---

## 4. 当前推荐的下游接入方式

### 4.1 新下游

推荐直接消费：

- `/api/radar/sources`
- `/api/radar/scan/:sourceId`

典型下游包括：

- 前端页面
- 定时拉取脚本
- 数据入库任务
- 内容雷达/选题系统
- 通知机器人

### 4.2 为什么推荐 radar 命名空间

因为它比旧路由更稳定：

- 字段更统一
- 错误语义更明确
- 源级元数据更完整
- 更适合程序化处理

详细字段契约见：

- [docs/downstream-api.md](/Users/rick/Agent/dailyhotapi-rww/docs/downstream-api.md)

---

## 5. 当前已知源状态

截至当前版本：

### 正常可用

大多数源仍可通过 `/api/radar/*` 正常消费，包括：

- `bilibili`
- `weibo`
- `zhihu`
- `36kr`
- `producthunt`
- `v2ex`
- `sspai`
- `juejin`
- `nodeSeek`
- 以及其他仍在源列表中的路由

### 暂时下线

以下源当前不再作为可扫描源暴露：

- `coolapk`
- `earthquake`
- `lol`

它们在 `/all` 中会显示为：

- `This interface is temporarily offline`

这样下游不会继续把它们当作正常可拉取源。

---

## 6. 当前内置前端

当前仓库已经有内置前端，不是前后端分离项目。

主要页面：

- `/`
  首页
- `/radar`
  热榜雷达控制台
- `/404`
  由 `notFound` 逻辑返回
- 错误页

控制台的核心价值是：

- 方便人工检查源是否正常
- 方便浏览条目与错误状态
- 为后续运营和下游联调提供浏览层

但请注意：

- 仓库的核心仍然是 API 服务
- 内置前端只是辅助层，不是项目的主职责

---

## 7. 本地开发方式

### 7.1 安装依赖

```bash
pnpm install
```

### 7.2 本地开发

```bash
pnpm dev
```

默认访问：

- `http://localhost:6688/`
- `http://localhost:6688/radar`

### 7.3 构建

```bash
pnpm build
```

### 7.4 生产启动

```bash
pnpm start
```

当前生产启动执行的是：

- `dist/server.js`

---

## 8. 当前测试与验证方式

本仓库已建立最小回归验证链：

```bash
pnpm test
pnpm lint
pnpm build
```

当前测试覆盖的重点包括：

- `/api/radar/sources`
- `/api/radar/scan/:sourceId`
- radar 错误包
- `/all` 兼容行为
- `producthunt` feed 解析
- `/radar` 控制台壳层

---

## 9. 当前 VPS 部署状态

截至当前工作进度，VPS 方案已经明确为：

- 部署方式：宝塔 + PM2 项目 + Nginx 反向代理
- 目标域名：`hotapi.ricktung.com`
- 运行端口：`6688`
- 进程入口：`dist/server.js`

### 9.1 已完成

代码侧已经完成：

- 生产启动修复
- 宝塔 PM2 项目适配
- `ecosystem.server.cjs` 生成
- 宝塔部署文档整理
- VPS 升级脚本整理

### 9.2 当前需要你在 VPS 上确认的事项

如果 VPS 还没有跑通，最关键检查点只有这几个：

1. 服务器源码是否已经拉到最新 `master`
2. 是否执行过：
   - `pnpm install --frozen-lockfile`
   - `pnpm build`
3. 宝塔 PM2 项目的启动文件是否填写为：

```text
/www/wwwroot/apps/dailyhotapi-rww/dist/server.js
```

而不是：

```text
/www/wwwroot/apps/dailyhotapi-rww/dist/index.js
```

### 9.3 当前对 VPS 状态的准确描述

当前代码端部署准备已经完成，**但最终线上是否已经恢复正常监听端口，取决于 VPS 是否已经拉取到最新源码并在宝塔里改成 `dist/server.js` 启动。**

也就是说：

- 代码侧：已就绪
- VPS 侧：需要你执行更新与重启确认

---

## 10. 当前推荐的生产部署方案

当前推荐：

- 宝塔面板管理：
  - 域名
  - SSL
  - 站点
  - 反向代理
  - 日志
- 宝塔 PM2 项目管理：
  - Node API 进程
- 项目监听：
  - `127.0.0.1:6688`
- 对外域名：
  - `https://hotapi.ricktung.com`

详细部署说明见：

- [docs/baota-vps-deploy.md](/Users/rick/Agent/dailyhotapi-rww/docs/baota-vps-deploy.md)

---

## 11. VPS 更新方案

本地完成开发并 push 之后，VPS 推荐按下面顺序升级：

```bash
cd /www/wwwroot/apps/dailyhotapi-rww
git fetch origin
git checkout master
git pull --ff-only origin master
pnpm install --frozen-lockfile
pnpm build
```

如果你使用的是宝塔 PM2 项目：

- 在宝塔界面里点“重启”

如果你使用的是命令行 PM2：

```bash
pm2 reload ecosystem.server.cjs --only dailyhotapi-rww || pm2 start ecosystem.server.cjs --only dailyhotapi-rww
pm2 save
```

### 11.1 已提供脚本

仓库已提供：

- [scripts/deploy-vps.sh](/Users/rick/Agent/dailyhotapi-rww/scripts/deploy-vps.sh)

它会自动执行：

- 拉最新代码
- 安装依赖
- 构建项目
- 提示你去宝塔重启 PM2 项目

使用方式：

```bash
cd /www/wwwroot/apps/dailyhotapi-rww
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

---

## 12. 当前运维建议

### 12.1 单实例

MVP 阶段建议：

- PM2 `instances = 1`

原因：

- 项目当前有进程内缓存（NodeCache）
- 多实例会带来缓存不一致

### 12.2 Redis

Redis 目前不是必须，但建议作为下一步增强：

- 重启后缓存保留
- 后续多实例更稳
- 对上游源更友好

### 12.3 域名建议

下游统一使用固定基地址：

- `https://hotapi.ricktung.com`

避免：

- IP 直连
- 临时端口
- 环境切换时频繁修改调用地址

---

## 13. 仓库内的重要文档

- 下游接口文档：
  [docs/downstream-api.md](/Users/rick/Agent/dailyhotapi-rww/docs/downstream-api.md)
- 宝塔 VPS 部署文档：
  [docs/baota-vps-deploy.md](/Users/rick/Agent/dailyhotapi-rww/docs/baota-vps-deploy.md)
- VPS 更新脚本：
  [scripts/deploy-vps.sh](/Users/rick/Agent/dailyhotapi-rww/scripts/deploy-vps.sh)

---

## 14. 维护说明

### 14.1 主仓库

主仓库负责：

- 项目代码
- API 契约
- 部署文档
- 对 GitHub 的正式同步

### 14.2 本地专用版本控制

以下内容不进入 GitHub 主仓库，但仍保留本地版本历史：

- `AGENTS.md`
- `docs/plans/**`

当前使用：

- 主仓库 `.git/`
- 本地专用仓库 `.git-local/`

也就是说：

- 项目正式代码走主仓库
- 本地协作与计划文档走本地专用仓库

---

## 15. 一句话总结

`dailyhotapi-rww` 当前已经不是上游那个“泛热榜聚合 demo”的用法了。

它现在是：

> 一个面向下游系统、带统一 radar API、内置控制台、适合宝塔 VPS 部署的独立热榜 API 服务。
