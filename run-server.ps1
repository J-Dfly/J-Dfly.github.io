# 飞哥网站 - 服务器启动脚本
# 此脚本直接从项目根目录运行，快速启动API服务器

Write-Host "=== 飞哥网站 - API服务器启动器 ===" -ForegroundColor Cyan
Write-Host ""

# 获取当前IP信息
Write-Host "正在获取网络信息..." -ForegroundColor Yellow
try {
    $ipOutput = node -e "require('./get-ip')" | Out-String
    if ($ipOutput) {
        Write-Host "✓ 网络信息获取成功" -ForegroundColor Green
    }
} catch {
    Write-Host "! 获取网络信息失败，但服务器仍将启动" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "正在启动API服务器..." -ForegroundColor Yellow
Write-Host "服务器将在 http://localhost:3000 运行" -ForegroundColor Green
Write-Host "API请求: http://localhost:3000/api/bilibili-fans?uid=用户ID" -ForegroundColor Green
Write-Host ""
Write-Host "提示: 如需从移动设备访问，请使用上面显示的IP地址" -ForegroundColor Cyan
Write-Host "      或在index.html后添加参数 ?api=http://你的IP:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Red
Write-Host ""

# 启动服务器
Set-Location -Path "server"
node server.js 