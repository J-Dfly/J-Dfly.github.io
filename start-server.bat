@echo off
echo 启动B站粉丝数据API服务器...
echo.
echo API服务器将在 http://localhost:3000 运行
echo 请求API: http://localhost:3000/api/bilibili-fans?uid=用户ID
echo.
echo 按 Ctrl+C 停止服务器
echo.
cd server
node server.js 