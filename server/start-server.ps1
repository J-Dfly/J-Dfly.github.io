# 飞哥网站 - 服务器启动器 (PowerShell)
Write-Host "=== 飞哥网站 - 服务器启动器 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "正在启动API服务器..." -ForegroundColor Yellow
Write-Host "服务器将在 http://localhost:3000 运行"
Write-Host "API请求: http://localhost:3000/api/bilibili-fans?uid=用户ID"
Write-Host ""
Write-Host "提示: " -ForegroundColor Green
Write-Host " - 本地访问: 在浏览器中打开 index.html"
Write-Host " - 移动设备访问: 使用test/tools目录下的工具"
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

# 启动服务器
node server.js 