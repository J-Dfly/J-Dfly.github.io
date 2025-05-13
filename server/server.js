const http = require('http');
const https = require('https');
const url = require('url');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // 设置CORS头，允许所有来源访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 提供B站粉丝数据API
  if (pathname === '/api/bilibili-fans') {
    // 从查询参数中获取B站用户ID
    const uid = parsedUrl.query.uid || '2';  // 默认使用B站官方账号UID
    
    // 构建B站API请求URL
    const bilibiliApiUrl = `https://api.bilibili.com/x/relation/stat?vmid=${uid}&jsonp=jsonp`;
    
    // 发送请求到B站API
    https.get(bilibiliApiUrl, (apiRes) => {
      let data = '';
      
      // 接收数据
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      // 数据接收完成，发送给客户端
      apiRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    }).on('error', (err) => {
      // 处理错误
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        code: -1, 
        message: '获取B站数据失败', 
        error: err.message 
      }));
    });
  } else {
    // 对于其他请求路径，返回404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      code: 404, 
      message: '未找到API路径，只支持/api/bilibili-fans' 
    }));
  }
});

// 设置服务器监听端口
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`B站粉丝数据API服务器运行在 http://localhost:${PORT}/`);
  console.log(`访问 http://localhost:${PORT}/api/bilibili-fans?uid=用户ID 获取B站粉丝数据`);
  console.log(`...`);
}); 