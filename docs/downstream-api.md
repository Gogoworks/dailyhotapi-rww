# `dailyhotapi-rww` 下游 API 接口文档

> 版本：基于当前仓库实现生成  
> 面向对象：前端、脚本、定时任务、采集器、内容流水线、数据服务  
> 推荐程度：**新接入统一优先使用 `/api/radar/*`**

---

## 1. 项目介绍

`dailyhotapi-rww` 是一个独立的热榜 API 服务。

它的核心作用只有一个：

- 把不同平台的热榜、热点、趋势数据整理成统一、可拉取、可消费的接口输出

这个项目适合被以下下游直接消费：

- 前端页面
- 定时采集脚本
- 数据入库任务
- 内容雷达/选题系统
- 通知机器人
- 其他聚合服务

它的价值不在于“展示页面”，而在于：

- 提供统一出口
- 尽量减少下游自己适配多源的成本
- 保留来源、更新时间、缓存和错误等机器可用信息

### 1.1 这个项目是什么

你可以把它理解成：

- 一个热榜源聚合层
- 一个统一数据接口层
- 一个面向下游的基础数据服务

它负责做的事包括：

- 拉取上游热榜源
- 归一常用字段
- 暴露稳定接口
- 返回来源、缓存、时间、状态等元数据

### 1.2 这个项目不是什么

它不是：

- 内容平台本体
- 选题判断系统
- 事实核验系统
- 某个固定前端的私有后端
- 某个固定下游仓库的硬编码适配层

也就是说，下游不应该把它当成“页面内部接口”，而应该把它当成“独立数据服务”来接。

### 1.3 下游为什么要接它

如果下游直接对接多个上游平台，通常会遇到这些问题：

- 每个平台字段结构不同
- 有的返回 JSON，有的要抓页面，有的要走 RSS
- 缓存和更新时间难统一
- 单源失败时缺乏统一错误语义

这个项目的存在，就是把这些差异尽量收敛到一个统一出口。

### 1.4 下游最应该知道的一句话

对于下游来说，`dailyhotapi-rww` 的意义可以概括为：

> 不需要关心每个热榜源怎么抓，只需要关心通过什么接口拿到统一数据。

---

## 2. 文档目标

这份文档说明本仓库当前对下游开放的接口契约，以及下游应如何稳定消费这些接口。

本仓库的定位是：

- 独立热榜 API 服务
- 提供统一数据出口
- 不假设任何固定前端或固定下游存在

因此，下游应把它当成一个“数据服务”来接入，而不是某个页面的内部接口。

---

## 3. 推荐接入方式

### 3.1 新下游推荐

所有**新下游**统一优先接入：

- `GET /api/radar/health`
- `GET /api/radar/sources`
- `GET /api/radar/scan/:sourceId`

原因：

- 返回结构稳定
- 错误包统一为 JSON（结构化数据格式）
- 带有源级元数据
- 更适合机器消费

### 3.2 旧兼容路由

仓库仍保留旧公共路由：

- `GET /all`
- `GET /:sourceId`

这些路由仍可用，但它们更偏向历史兼容与通用聚合输出，不建议新下游作为主契约依赖。

---

## 4. 基础约定

### 4.1 协议与返回

- 协议：HTTP
- 编码：UTF-8
- 默认返回：JSON
- 只有旧路由 `/:sourceId?rss=true` 会返回 RSS（聚合订阅格式）XML

### 4.2 基础返回包

`/api/radar/*` 统一使用以下成功包结构：

```json
{
  "code": 200,
  "data": {},
  "meta": {
    "path": "/api/radar/...",
    "timestamp": "2026-03-13T07:17:38.845Z"
  }
}
```

`/api/radar/*` 统一使用以下错误包结构：

```json
{
  "code": 404,
  "message": "Source not found",
  "data": null,
  "error": {
    "type": "not_found",
    "details": {
      "source_id": "unknown-source"
    }
  },
  "meta": {
    "path": "/api/radar/scan/unknown-source",
    "timestamp": "2026-03-13T07:17:38.845Z"
  }
}
```

---

## 5. 推荐接口

## 5.1 健康检查

### 请求

```http
GET /api/radar/health
```

### 作用

用于判断：

- 服务是否可用
- 数据层是否可用
- 当前已注册源总数
- 默认缓存 TTL（缓存过期时间）

### 成功响应示例

```json
{
  "code": 200,
  "data": {
    "service_status": "ok",
    "data_status": "available",
    "sources_count": 56,
    "cache_ttl_default": 3600
  },
  "meta": {
    "path": "/api/radar/health",
    "timestamp": "2026-03-13T07:17:38.845Z"
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `service_status` | `string` | 服务状态，当前实现为 `ok` |
| `data_status` | `string` | 数据状态，当前实现为 `available` |
| `sources_count` | `number` | 当前注册可扫描源总数 |
| `cache_ttl_default` | `number` | 默认缓存时长，单位秒 |

---

## 5.2 源列表

### 请求

```http
GET /api/radar/sources
```

### 作用

返回当前所有可扫描源的最小目录，用于：

- 初始化源列表
- 让下游动态发现可用源
- 避免把源列表硬编码到下游

### 成功响应示例

```json
{
  "code": 200,
  "data": {
    "count": 56,
    "sources": [
      {
        "source_id": "bilibili",
        "route_path": "/bilibili",
        "radar_path": "/api/radar/scan/bilibili"
      },
      {
        "source_id": "weibo",
        "route_path": "/weibo",
        "radar_path": "/api/radar/scan/weibo"
      }
    ]
  },
  "meta": {
    "path": "/api/radar/sources",
    "timestamp": "2026-03-13T07:17:38.845Z"
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `count` | `number` | 当前源总数 |
| `sources[].source_id` | `string` | 源唯一标识，供下游扫描与去重使用 |
| `sources[].route_path` | `string` | 历史兼容公共路由路径 |
| `sources[].radar_path` | `string` | 推荐机器消费扫描路径 |

### 下游建议

下游启动时：

1. 先拉一次 `/api/radar/sources`
2. 获取关心的 `source_id`
3. 再按 `source_id` 调用 `/api/radar/scan/:sourceId`

---

## 5.3 单源扫描

### 请求

```http
GET /api/radar/scan/:sourceId
```

### 路径参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `sourceId` | `string` | 是 | 源 ID，例如 `weibo`、`bilibili` |

### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `cache` | `string` | 否 | 命中缓存 | 当值为 `false` 时，跳过缓存重新抓取 |
| `limit` | `number` | 否 | 全量 | 限制返回条目数，仅影响最终输出，不改变源级原始条目数 |

### 请求示例

```bash
curl http://localhost:6688/api/radar/scan/weibo
curl "http://localhost:6688/api/radar/scan/weibo?limit=10"
curl "http://localhost:6688/api/radar/scan/weibo?cache=false"
```

### 成功响应结构

```json
{
  "code": 200,
  "data": {
    "source": {},
    "items": []
  },
  "meta": {
    "path": "/api/radar/scan/weibo",
    "timestamp": "2026-03-13T07:17:38.845Z"
  }
}
```

### `data.source` 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `source_id` | `string` | 源 ID |
| `source_name` | `string` | 源显示名称 |
| `platform` | `string` | 平台名称，当前实现通常与 `source_name` 一致 |
| `category` | `string` | 当前分类/榜单类型 |
| `fetched_at` | `string \| null` | 本次扫描完成时间，ISO 8601 |
| `updated_at` | `string \| null` | 源数据更新时间，ISO 8601 |
| `from_cache` | `boolean` | 本次结果是否来自缓存 |
| `cache_ttl` | `number \| null` | 当前源缓存时长，单位秒 |
| `status` | `"ok" \| "error"` | 源状态；成功响应当前为 `ok` |
| `latency_ms` | `number` | 单次扫描耗时，毫秒 |
| `error_message` | `string \| null` | 错误信息；成功时为 `null` |
| `raw_count` | `number` | 源侧原始条目数 |
| `normalized_count` | `number` | 最终输出条目数 |
| `route_path` | `string` | 对应历史兼容路由 |
| `radar_path` | `string` | 当前扫描路径 |
| `link` | `string \| null` | 源页面地址 |
| `description` | `string \| null` | 源描述 |
| `params` | `object \| null` | 源支持的额外参数说明 |

### `data.items[]` 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string \| number` | 条目唯一标识 |
| `title` | `string` | 标题 |
| `summary` | `string \| null` | 摘要 |
| `url` | `string` | 桌面端链接 |
| `mobile_url` | `string \| null` | 移动端链接 |
| `rank` | `number` | 当前返回结果中的排序位置，从 `1` 开始 |
| `hot` | `number \| null` | 热度值，部分源为空 |
| `published_at` | `string \| null` | 发布时间，ISO 8601 |
| `raw_source` | `string` | 原始源 ID |
| `topic_hint` | `string \| null` | 主题提示，当前实现为空 |
| `tempo_hint` | `string \| null` | 节奏提示，当前实现为空 |
| `signal_hints` | `string[]` | 轻量信号提示，当前实现为空数组 |
| `raw` | `object` | 原始归一前条目对象，供下游复核 |

### 成功响应示例

```json
{
  "code": 200,
  "data": {
    "source": {
      "source_id": "weibo",
      "source_name": "微博",
      "platform": "微博",
      "category": "热搜榜",
      "fetched_at": "2026-03-13T07:39:51.000Z",
      "updated_at": "2026-03-13T07:39:51.000Z",
      "from_cache": false,
      "cache_ttl": 60,
      "status": "ok",
      "latency_ms": 125,
      "error_message": null,
      "raw_count": 52,
      "normalized_count": 52,
      "route_path": "/weibo",
      "radar_path": "/api/radar/scan/weibo",
      "link": "https://s.weibo.com/top/summary/",
      "description": "实时热点，每分钟更新一次",
      "params": null
    },
    "items": [
      {
        "id": "weibo-0",
        "title": "示例标题",
        "summary": "#示例标题#",
        "url": "https://s.weibo.com/weibo?q=%E7%A4%BA%E4%BE%8B",
        "mobile_url": "https://s.weibo.com/weibo?q=%E7%A4%BA%E4%BE%8B",
        "rank": 1,
        "hot": null,
        "published_at": "2026-03-13T07:39:51.000Z",
        "raw_source": "weibo",
        "topic_hint": null,
        "tempo_hint": null,
        "signal_hints": [],
        "raw": {
          "id": "weibo-0",
          "title": "示例标题"
        }
      }
    ]
  },
  "meta": {
    "path": "/api/radar/scan/weibo",
    "timestamp": "2026-03-13T07:39:51.000Z"
  }
}
```

---

## 6. 错误约定

## 6.1 未知源

### 请求

```http
GET /api/radar/scan/unknown-source
```

### 响应

```json
{
  "code": 404,
  "message": "Source not found",
  "data": null,
  "error": {
    "type": "not_found",
    "details": {
      "source_id": "unknown-source"
    }
  },
  "meta": {
    "path": "/api/radar/scan/unknown-source",
    "timestamp": "2026-03-13T07:17:38.845Z"
  }
}
```

## 6.2 上游抓取失败

### 响应

```json
{
  "code": 502,
  "message": "Source fetch failed",
  "data": null,
  "error": {
    "type": "source_error",
    "details": {
      "source_id": "weibo",
      "error_message": "..."
    }
  },
  "meta": {
    "path": "/api/radar/scan/weibo",
    "timestamp": "2026-03-13T07:17:38.845Z"
  }
}
```

## 6.3 radar 路由不存在

### 响应

```json
{
  "code": 404,
  "message": "Radar endpoint not found",
  "data": null,
  "error": {
    "type": "not_found",
    "details": null
  }
}
```

## 6.4 radar 内部错误

### 响应

```json
{
  "code": 500,
  "message": "Radar request failed",
  "data": null,
  "error": {
    "type": "internal_error",
    "details": {
      "error_message": "..."
    }
  }
}
```

### 下游错误处理建议

下游只需要稳定处理这三层：

1. HTTP 状态码
2. `code`
3. `error.type`

推荐按下面分支处理：

- `404 + not_found`：源不存在或路由错误
- `502 + source_error`：上游源失败，可重试或降级
- `500 + internal_error`：服务内部错误，应告警

---

## 7. 缓存策略

### 7.1 默认 TTL

全局默认缓存时长为：

- `3600` 秒
- 即 `60` 分钟

### 7.2 当前已知覆盖

| 源 | TTL |
| --- | --- |
| `weibo` | `60` 秒 |
| `github` | `86400` 秒 |
| `huxiu` | `null`，当前实现不走统一缓存 |
| 其他大多数源 | 默认 `3600` 秒 |

### 7.3 下游轮询建议

推荐按 `source.cache_ttl` 做轮询间隔：

- 若为具体数字，按该值或略高于该值轮询
- 若为 `null`，建议保守轮询，例如 `5` 到 `15` 分钟

### 7.4 强制刷新

当需要绕过缓存时：

```http
GET /api/radar/scan/weibo?cache=false
```

---

## 8. 去重与入库建议

### 8.1 源级去重

推荐使用：

- `source_id`
- `updated_at`

判断这一轮源是否有新变化。

### 8.2 条目级去重

推荐优先使用：

- `source_id + id`

其次可退化为：

- `source_id + url`
- `source_id + title`

### 8.3 入库建议

如果下游要长期保存，建议至少落以下字段：

- 源级：
  - `source_id`
  - `source_name`
  - `category`
  - `updated_at`
  - `from_cache`
  - `latency_ms`
  - `error_message`
- 条目级：
  - `id`
  - `title`
  - `summary`
  - `url`
  - `rank`
  - `hot`
  - `published_at`
  - `raw`

---

## 9. 旧兼容接口

> 这部分是兼容文档。  
> **新下游不推荐以此为主契约。**

## 9.1 获取全部旧路由

### 请求

```http
GET /all
```

### 响应示例

```json
{
  "code": 200,
  "count": 56,
  "routes": [
    {
      "name": "bilibili",
      "path": "/bilibili"
    },
    {
      "name": "weibo",
      "path": "/weibo"
    }
  ]
}
```

## 9.2 获取单源旧格式数据

### 请求

```http
GET /weibo
```

### 支持的公共查询参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `cache=false` | `string` | 跳过缓存重新抓取 |
| `limit=10` | `number` | 限制返回条目数 |
| `rss=true` | `string` | 返回 RSS XML |

### 旧格式响应特征

旧路由响应通常形如：

```json
{
  "code": 200,
  "name": "微博",
  "title": "微博",
  "type": "热搜榜",
  "total": 50,
  "fromCache": false,
  "updateTime": "2026-03-13T07:39:51.000Z",
  "data": []
}
```

### 注意事项

- 字段命名与 `/api/radar/*` 不同
- 错误处理历史兼容性较强，不如 radar 命名空间稳定
- 仅适合存量兼容，不适合作为新集成主契约

---

## 10. 接入示例

## 10.1 JavaScript / TypeScript

```ts
const sourcesRes = await fetch("http://localhost:6688/api/radar/sources");
const sourcesPayload = await sourcesRes.json();

if (sourcesPayload.code !== 200) {
  throw new Error("加载源列表失败");
}

const sourceId = sourcesPayload.data.sources[0].source_id;
const scanRes = await fetch(`http://localhost:6688/api/radar/scan/${sourceId}`);
const scanPayload = await scanRes.json();

if (scanPayload.code !== 200) {
  console.error(scanPayload.error);
} else {
  const { source, items } = scanPayload.data;
  console.log(source.source_id, source.updated_at, items.length);
}
```

## 10.2 Python

```python
import requests

base = "http://localhost:6688"

sources = requests.get(f"{base}/api/radar/sources").json()
first_source_id = sources["data"]["sources"][0]["source_id"]

scan = requests.get(f"{base}/api/radar/scan/{first_source_id}").json()

if scan["code"] == 200:
    source = scan["data"]["source"]
    items = scan["data"]["items"]
    print(source["source_id"], source["updated_at"], len(items))
else:
    print(scan["error"])
```

## 10.3 cURL

```bash
curl http://localhost:6688/api/radar/health
curl http://localhost:6688/api/radar/sources
curl http://localhost:6688/api/radar/scan/bilibili
curl "http://localhost:6688/api/radar/scan/weibo?limit=10"
curl "http://localhost:6688/api/radar/scan/weibo?cache=false"
```

---

## 11. 当前可用源列表

当前仓库注册的 `source_id` 如下：

```text
36kr
51cto
52pojie
acfun
baidu
bilibili
coolapk
csdn
dgtle
douban-group
douban-movie
douyin
earthquake
gameres
geekpark
genshin
github
guokr
hackernews
hellogithub
history
honkai
hostloc
hupu
huxiu
ifanr
ithome
ithome-xijiayi
jianshu
juejin
kuaishou
linuxdo
lol
miyoushe
netease-news
newsmth
ngabbs
nodeseek
nytimes
producthunt
qq-news
sina
sina-news
smzdm
sspai
starrail
thepaper
tieba
toutiao
v2ex
weatheralarm
weibo
weread
yystv
zhihu
zhihu-daily
```

---

## 12. 下游接入建议总结

如果你是：

### 前端页面

优先使用：

- `/api/radar/sources`
- `/api/radar/scan/:sourceId`

### 定时采集任务

优先使用：

- `source_id`
- `updated_at`
- `cache_ttl`

做轮询和去重。

### 内容/选题系统

优先保存：

- `source`
- `items`
- `raw`

不要只存 `title`。

### 兼容历史系统

可继续使用：

- `/all`
- `/:sourceId`

但建议逐步迁移到 `/api/radar/*`。

---

## 13. 版本说明

这份文档对应的是当前仓库实现，不是抽象规划版。

如果接口后续新增：

- 新命名空间
- 多源批量扫描
- 更完整的 hint 字段
- 更精细的源目录元数据

请同步更新这份文档。
