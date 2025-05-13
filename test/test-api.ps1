# B站API测试脚本 (PowerShell)
Write-Host "=== B站API测试脚本 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "正在测试API服务器连接..." -ForegroundColor Yellow
Write-Host ""

$apiUrl = "http://localhost:3000/api/bilibili-fans?uid=2"
Write-Host "测试URL: $apiUrl"
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.code -eq 0 -and $result.data) {
        Write-Host "✓ API服务器工作正常!" -ForegroundColor Green
        Write-Host "粉丝数: $($result.data.follower)" -ForegroundColor Cyan
        Write-Host "关注数: $($result.data.following)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ API服务器返回错误:" -ForegroundColor Red
        Write-Host $result | ConvertTo-Json -Depth 2
    }
} catch {
    Write-Host "✗ 连接失败:" -ForegroundColor Red
    Write-Host "错误: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "1. API服务器未启动 (运行 node server.js)"
    Write-Host "2. 端口可能被占用或被防火墙阻止"
    Write-Host "3. 网络连接问题"
}

Write-Host ""
Write-Host "按任意键继续..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 