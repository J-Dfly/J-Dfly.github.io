/**
 * B站粉丝数据获取与展示
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const followerElement = document.getElementById('bilibili-followers');
    const followingElement = document.getElementById('bilibili-following');
    const nameElement = document.getElementById('bilibili-name');
    const refreshButton = document.getElementById('refreshBtn');
    const uidInput = document.getElementById('uidInput');
    const avatarElement = document.getElementById('bilibili-avatar');
    const connectionInfo = document.getElementById('connection-info');
    
    // 默认的B站UID（B站官方账号）
    let currentUid = '2';
    
    // API服务器URL - 自动检测当前环境
    const getApiServer = () => {
        // 检查URL参数中是否指定了API服务器地址
        const urlParams = new URLSearchParams(window.location.search);
        const apiParam = urlParams.get('api');
        
        if (apiParam) {
            return apiParam;
        }
        
        // 获取当前页面URL的主机部分
        const currentHost = window.location.hostname;
        const currentProto = window.location.protocol;
        
        // 本地文件访问或localhost
        if (currentHost === '' || currentProto === 'file:' || 
            currentHost === 'localhost' || currentHost === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        
        // 网站环境 - 尝试使用相同域名下的API或者回退到localhost
        try {
            // 首先尝试相同域名
            return currentProto + '//' + currentHost + (currentHost.includes(':') ? '' : ':3000');
        } catch (e) {
            console.error('无法构建API URL:', e);
            return 'http://localhost:3000'; // 回退到默认值
        }
    };
    
    const API_SERVER = getApiServer();
    console.log('使用API服务器:', API_SERVER);
    
    // 显示API服务器地址和连接信息
    const showConnectionInfo = () => {
        if (connectionInfo) {
            // 清空现有内容
            connectionInfo.innerHTML = '';
            
            // 添加API服务器信息
            const apiInfo = document.createElement('div');
            apiInfo.style.fontSize = '12px';
            apiInfo.style.color = '#86868b';
            apiInfo.style.margin = '5px 0';
            apiInfo.innerHTML = `当前API: <span style="color:#0070F5">${API_SERVER}</span>`;
            
            // 添加配置提示
            const helpInfo = document.createElement('div');
            helpInfo.style.fontSize = '12px';
            helpInfo.style.color = '#86868b';
            helpInfo.style.margin = '5px 0';
            helpInfo.innerHTML = `<span style="color:#ff6b81">提示: 网站访问请使用 ?api=http://你的服务器IP:3000 参数</span>`;
            
            // 添加手动配置链接
            const manualLink = document.createElement('div');
            manualLink.style.fontSize = '12px';
            manualLink.style.margin = '5px 0';
            manualLink.innerHTML = `<a href="javascript:void(0)" id="manualApiConfig" style="color:#0070F5;text-decoration:underline">点击手动配置API地址</a>`;
            
            // 添加到页面
            connectionInfo.appendChild(apiInfo);
            connectionInfo.appendChild(helpInfo);
            connectionInfo.appendChild(manualLink);
            
            // 添加手动配置点击事件
            document.getElementById('manualApiConfig').addEventListener('click', () => {
                const userInput = prompt('请输入API服务器地址:', 'http://localhost:3000');
                if (userInput && userInput.trim() !== '') {
                    window.location.href = window.location.pathname + '?api=' + encodeURIComponent(userInput.trim());
                }
            });
        }
    };
    
    // 从URL参数中获取默认UID
    const urlParams = new URLSearchParams(window.location.search);
    const uidParam = urlParams.get('uid');
    if (uidParam) {
        currentUid = uidParam;
        uidInput.value = uidParam;
    }
    
    // 显示连接信息
    showConnectionInfo();
    
    // 格式化数字，添加千位分隔符
    function formatNumber(num) {
        if (!num && num !== 0) return "--";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // 清除动画效果
    function clearAnimations() {
        followerElement.classList.remove('number-updated');
        followingElement.classList.remove('number-updated');
    }
    
    // 设置加载状态
    function setLoadingState() {
        clearAnimations();
        followerElement.textContent = '加载中...';
        followingElement.textContent = '加载中...';
        nameElement.textContent = '加载中...';
    }
    
    // 设置错误状态
    function setErrorState(message) {
        clearAnimations();
        followerElement.textContent = '获取失败';
        followingElement.textContent = '获取失败';
        nameElement.textContent = message || '连接服务器失败';
        
        // 在控制台输出详细错误信息
        console.error('API连接错误:', message);
    }
    
    // 获取B站用户信息
    async function fetchBilibiliUserInfo(uid) {
        try {
            // 设置加载状态
            setLoadingState();
            
            // 构建API URL
            const apiUrl = `${API_SERVER}/api/bilibili-fans?uid=${uid}`;
            console.log('正在请求:', apiUrl);
            
            // 使用独立的API服务器获取数据
            const response = await fetch(apiUrl, {
                mode: 'cors',  // 明确指定跨域模式
                headers: {
                    'Accept': 'application/json'  // 明确请求JSON
                }
            });
            
            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
            // 检查Content-Type
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(`无效的内容类型: ${contentType}，期望JSON`);
            }
            
            const data = await response.json();
            
            if (data.code === 0 && data.data) {
                // 更新粉丝数和关注数
                followerElement.textContent = formatNumber(data.data.follower);
                followingElement.textContent = formatNumber(data.data.following);
                
                // 尝试获取用户名
                getUserName(uid);
                
                // 添加数字增长的动画效果
                followerElement.classList.add('number-updated');
                followingElement.classList.add('number-updated');
                
                // 移除动画类，以便下次使用
                setTimeout(() => {
                    clearAnimations();
                }, 1000);
                
                return true;
            } else {
                throw new Error(data.message || '获取数据失败');
            }
        } catch (error) {
            console.error('获取B站数据出错:', error);
            
            // 给出更友好的提示
            let errorMsg = '';
            if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
                errorMsg = `网络连接失败：请确保API服务器运行中<br>
                <span style="font-size:12px;color:#ff6b81">
                1. API地址: ${API_SERVER}<br>
                2. 如果是在网站上访问，需要确保API服务器允许跨域请求<br>
                3. 尝试点击下方"手动配置API地址"</span>`;
            } else if (error.message.includes('JSON')) {
                errorMsg = `数据格式错误：服务器未返回JSON数据<br>
                <span style="font-size:12px;color:#ff6b81">
                1. 可能访问了错误的服务器地址<br>
                2. API服务器可能未正确设置CORS头<br>
                3. 请尝试使用本地方式访问，或修改API地址</span>`;
            } else {
                errorMsg = `连接API服务器失败: ${error.message}<br>
                <span style="font-size:12px;color:#ff6b81">
                请尝试点击下方"手动配置API地址"</span>`;
            }
            setErrorState(errorMsg);
            return false;
        }
    }
    
    // 获取用户名
    async function getUserName(uid) {
        try {
            // 这里使用B站Space API获取用户名
            // 注意：在实际应用中，您可能需要在服务器端实现这个功能
            // 目前使用一个占位
            nameElement.textContent = `B站用户 (UID: ${uid})`;
            
            // 获取一个默认头像或B站Logo
            avatarElement.src = 'images/bilibili-logo.png'; // 使用本地图片
            avatarElement.onerror = function() {
                // 如果本地图片加载失败，使用B站默认图片
                this.src = 'https://i0.hdslb.com/bfs/archive/4de86ebf7f463781a96337c23f767f53b65e30c1.png';
            };
        } catch (error) {
            console.error('获取用户名失败:', error);
            nameElement.textContent = `未知用户 (UID: ${uid})`;
        }
    }
    
    // 刷新按钮点击事件
    refreshButton.addEventListener('click', function() {
        // 获取输入框的UID，如果为空则使用当前UID
        const inputUid = uidInput.value.trim();
        if (inputUid) {
            currentUid = inputUid;
        }
        
        // 获取数据
        fetchBilibiliUserInfo(currentUid);
    });
    
    // 输入框按下回车键也触发刷新
    uidInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            refreshButton.click();
        }
    });
    
    // 初始加载
    fetchBilibiliUserInfo(currentUid);
}); 