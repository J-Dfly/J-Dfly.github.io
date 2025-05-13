/**
 * 网络工具 - 获取本机IP地址
 * 
 * 此工具可以帮助您:
 * 1. 获取本机所有可用IP地址
 * 2. 生成可用于移动设备访问的URL
 * 3. 解决网页无法连接服务器的问题
 */

// 获取本机IP地址
const os = require('os');

// 获取网络接口信息
const networkInterfaces = os.networkInterfaces();

console.log('=== 飞哥网站 - 网络工具 ===');
console.log('请使用以下地址在同一网络内的移动设备上访问:');
console.log('------------------------');

// 保存找到的IPv4地址
let foundAddresses = 0;
let ipAddresses = [];

// 遍历所有网络接口
for (const name of Object.keys(networkInterfaces)) {
  const netInterface = networkInterfaces[name];
  
  // 跳过禁用的接口
  if (!netInterface || netInterface.length === 0) continue;
  
  // 查找IPv4地址且非内部地址的接口
  for (const iface of netInterface) {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`接口名称: ${name}`);
      console.log(`IP地址: ${iface.address}`);
      console.log(`API服务器: http://${iface.address}:3000`);
      console.log(`完整访问URL: index.html?api=http://${iface.address}:3000`);
      console.log('------------------------');
      
      ipAddresses.push(iface.address);
      foundAddresses++;
    }
  }
}

if (foundAddresses === 0) {
  console.log('未找到可用的网络接口，请确保您的电脑已连接到网络');
  console.log('如果您使用的是虚拟机，可能需要配置网络为桥接模式');
  console.log('------------------------');
}

console.log('=== 使用说明 ===');
console.log('1. 启动API服务器:');
console.log('   - 运行 node server/server.js');
console.log('   - 或运行 PowerShell脚本 ./run-server.ps1');
console.log('');
console.log('2. 访问网页:');
console.log('   - 本地访问: 直接打开index.html');
console.log('   - 移动设备访问: 在手机浏览器中打开上面的完整访问URL');
console.log('');
console.log('3. 问题排查:');
console.log('   - 确保手机和电脑在同一WiFi网络下');
console.log('   - 检查防火墙设置，允许3000端口的访问');
console.log('   - 如果仍有问题，使用 ./fix-all.ps1 自动修复工具');

// 提供方便的地址导出
module.exports = {
  ipAddresses: ipAddresses
}; 