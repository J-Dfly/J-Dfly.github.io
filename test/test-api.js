const http = require('http');

// 测试配置
const config = {
  host: 'localhost',
  port: 3000,
  path: '/api/bilibili-fans?uid=2',
  method: 'GET'
};

console.log('正在测试B站API代理...');
console.log(`请求URL: http://${config.host}:${config.port}${config.path}`);

// 发送测试请求
const req = http.request(config, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('测试成功! 收到的数据:');
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (jsonData.code === 0 && jsonData.data) {
        console.log(`\n粉丝数: ${jsonData.data.follower}`);
        console.log(`关注数: ${jsonData.data.following}`);
        console.log('\n代理服务器工作正常!');
      } else {
        console.error('API返回了错误:', jsonData.message || '未知错误');
      }
    } catch (error) {
      console.error('解析JSON失败:', error.message);
      console.error('收到的原始数据:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('测试失败!', error.message);
  console.log('\n请确保服务器已经启动 (运行 node server.js)');
});

req.end(); 