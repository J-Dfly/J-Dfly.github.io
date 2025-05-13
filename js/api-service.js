/**
 * B站API服务 - 负责API连接和数据获取
 */

// API服务对象
const ApiService = {
    // API服务器URL
    apiServer: '',
    
    // 初始化API服务
    init() {
        this.apiServer = this.detectApiServer();
        console.log('API服务器初始化:', this.apiServer);
        return this.apiServer;
    },
    
    // 自动检测API服务器地址
    detectApiServer() {
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
    },
    
    // 获取B站用户信息
    async fetchUserInfo(uid) {
        try {
            // 构建API URL
            const apiUrl = `${this.apiServer}/api/bilibili-fans?uid=${uid}`;
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
            
            // 解析JSON响应
            const data = await response.json();
            
            if (data.code === 0 && data.data) {
                return {
                    success: true,
                    follower: data.data.follower,
                    following: data.data.following,
                    uid: uid
                };
            } else {
                throw new Error(data.message || '获取数据失败');
            }
        } catch (error) {
            console.error('获取B站数据出错:', error);
            
            // 根据错误类型返回不同的错误信息
            let errorMsg = '';
            if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
                errorMsg = `网络连接失败：请确保API服务器运行中<br>
                <span style="font-size:12px;color:#ff6b81">
                1. API地址: ${this.apiServer}<br>
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
            
            return {
                success: false,
                error: errorMsg
            };
        }
    }
}; 