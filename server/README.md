# B站粉丝数据API服务器

这是一个简单的Node.js API服务器，专门用于获取B站用户的粉丝数据，解决跨域(CORS)问题。

## 功能

- 提供B站粉丝数据API
- 解决跨域问题
- 简单轻量，无外部依赖
- 支持任意B站用户UID查询

## 环境要求

- Node.js 12.0 或更高版本

## 快速开始

1. 安装依赖（可选，如果使用开发模式）:

```bash
npm install
```

2. 启动API服务器:

```bash
# 方法1: 使用Node.js直接启动
node server.js

# 方法2: 使用npm脚本
npm start

# 方法3: 开发模式（自动重启）
npm run dev

# 方法4: Windows用户可以双击运行
start-server.bat
```

3. 服务器将在 http://localhost:3000 启动

## API使用

### 获取用户粉丝数据

**请求:**

```
GET /api/bilibili-fans?uid={用户ID}
```

**参数:**

- `uid`: B站用户ID (默认值: 2, 即B站官方账号)

**响应示例:**

```json
{
  "code": 0,
  "message": "0",
  "ttl": 1,
  "data": {
    "mid": 2,
    "following": 27,
    "whisper": 0,
    "black": 0,
    "follower": 10291293
  }
}
```

## 注意事项

- 本API服务器仅提供数据API，不处理静态文件
- 请勿频繁请求B站API，以避免IP被封
- 为保护隐私，本API不存储任何用户数据
- 仅供学习和测试使用 