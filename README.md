# 飞哥网站项目

这是一个采用苹果风格设计的美化HTML网站项目，包含前端页面和后端API服务。

## 项目结构

```
html/
├── index.html        # 主页面
├── styles.css        # 样式文件
├── js/               # JavaScript文件夹
│   ├── scripts.js    # 主要脚本
│   └── bilibili.js   # B站数据获取脚本
├── images/           # 图片资源
├── server/           # 后端服务器
│   ├── server.js     # API服务器
│   ├── package.json  # 项目依赖
│   └── README.md     # 服务器说明
├── test/             # 测试工具
│   ├── test-client.html  # API测试客户端
│   └── test-api.js       # API测试脚本
└── start-server.bat  # 启动服务器的批处理文件
```

## 使用方法

1. 启动后端API服务器：
   - 双击运行 `start-server.bat` 文件
   - 或在命令行中切换到server目录并运行 `node server.js`

2. 访问网站：
   - 在浏览器中打开 `index.html` 文件

3. 测试API：
   - 在浏览器中打开 `test/test-client.html` 文件
   - 或在命令行中运行 `node test/test-api.js`

## 功能特点

- 苹果风格设计，包括渐变色标题、圆角边框和阴影效果
- 图片展示功能，支持轮播效果
- B站粉丝数据展示功能
- 响应式设计，适配不同设备
- Node.js HTTP代理服务器，解决CORS问题

## 注意事项

- API服务器默认运行在 `http://localhost:3000`
- 请确保安装了Node.js环境
- 所有JavaScript文件已移动至js文件夹，确保引用路径正确

## 技术栈

- 前端：原生HTML/CSS/JavaScript，采用苹果风格设计
- 后端：Node.js HTTP服务器作为代理

## 环境要求

- Node.js 12.0 或更高版本

## 安装

1. 克隆或下载本项目
2. 进入项目目录
3. 安装依赖（虽然本项目几乎没有依赖，但为了后续扩展）

```bash
npm install
```

4. 下载B站Logo（如果images目录中已有图片可跳过）

```bash
# 使用Node.js下载
npm run download-logo
```

## 运行

启动服务器：

```bash
npm start
```

开发模式（需要安装nodemon）：

```bash
npm run dev
```

然后在浏览器中访问 `http://localhost:3000`

## 使用方法

1. 打开网站后，默认会显示B站官方账号的粉丝数据
2. 在输入框中输入任意B站用户的UID，点击"刷新数据"按钮获取该用户的粉丝数据
3. 如需查看图片轮播，点击"查看图片展示"按钮

## 注意事项

- 本项目仅用于学习和演示
- B站API可能会有调用限制，请勿频繁发送请求
- 为保护隐私，本项目不会存储任何用户数据 