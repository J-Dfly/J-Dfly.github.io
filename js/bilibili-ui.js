/**
 * B站UI模块 - 负责页面元素操作和数据展示
 */

// UI控制对象
const BilibiliUI = {
    // 页面元素
    elements: {
        followerElement: null,
        followingElement: null,
        nameElement: null,
        refreshButton: null,
        uidInput: null,
        avatarElement: null,
        connectionInfo: null
    },
    
    // 当前数据
    currentData: {
        uid: '2', // 默认B站官方账号
    },
    
    // 初始化UI
    init() {
        // 获取页面元素
        this.elements.followerElement = document.getElementById('bilibili-followers');
        this.elements.followingElement = document.getElementById('bilibili-following');
        this.elements.nameElement = document.getElementById('bilibili-name');
        this.elements.refreshButton = document.getElementById('refreshBtn');
        this.elements.uidInput = document.getElementById('uidInput');
        this.elements.avatarElement = document.getElementById('bilibili-avatar');
        this.elements.connectionInfo = document.getElementById('connection-info');
        
        // 从URL参数中获取默认UID
        const urlParams = new URLSearchParams(window.location.search);
        const uidParam = urlParams.get('uid');
        if (uidParam) {
            this.currentData.uid = uidParam;
            this.elements.uidInput.value = uidParam;
        }
        
        // 初始化API服务
        const apiServer = ApiService.init();
        
        // 显示连接信息
        this.showConnectionInfo(apiServer);
        
        // 添加事件监听
        this.setupEventListeners();
        
        // 初始加载数据
        this.loadUserData();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 刷新按钮点击事件
        this.elements.refreshButton.addEventListener('click', () => {
            // 获取输入框的UID，如果为空则使用当前UID
            const inputUid = this.elements.uidInput.value.trim();
            if (inputUid) {
                this.currentData.uid = inputUid;
            }
            
            // 加载数据
            this.loadUserData();
        });
        
        // 输入框回车事件
        this.elements.uidInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.elements.refreshButton.click();
            }
        });
    },
    
    // 显示API服务器连接信息
    showConnectionInfo(apiServer) {
        if (this.elements.connectionInfo) {
            // 清空现有内容
            this.elements.connectionInfo.innerHTML = '';
            
            // 添加API服务器信息
            const apiInfo = document.createElement('div');
            apiInfo.style.fontSize = '12px';
            apiInfo.style.color = '#86868b';
            apiInfo.style.margin = '5px 0';
            apiInfo.innerHTML = `当前API: <span style="color:#0070F5">${apiServer}</span>`;
            
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
            this.elements.connectionInfo.appendChild(apiInfo);
            this.elements.connectionInfo.appendChild(helpInfo);
            this.elements.connectionInfo.appendChild(manualLink);
            
            // 添加手动配置点击事件
            document.getElementById('manualApiConfig').addEventListener('click', () => {
                const userInput = prompt('请输入API服务器地址:', 'http://localhost:3000');
                if (userInput && userInput.trim() !== '') {
                    window.location.href = window.location.pathname + '?api=' + encodeURIComponent(userInput.trim());
                }
            });
        }
    },
    
    // 加载用户数据
    async loadUserData() {
        // 设置加载状态
        this.setLoadingState();
        
        // 通过API服务获取数据
        const result = await ApiService.fetchUserInfo(this.currentData.uid);
        
        // 处理结果
        if (result.success) {
            this.updateUserData(result);
        } else {
            this.setErrorState(result.error);
        }
    },
    
    // 更新用户数据显示
    updateUserData(data) {
        // 更新粉丝数和关注数
        this.elements.followerElement.textContent = this.formatNumber(data.follower);
        this.elements.followingElement.textContent = this.formatNumber(data.following);
        
        // 获取用户名
        this.getUserName(data.uid);
        
        // 添加数字增长的动画效果
        this.elements.followerElement.classList.add('number-updated');
        this.elements.followingElement.classList.add('number-updated');
        
        // 移除动画类，以便下次使用
        setTimeout(() => {
            this.clearAnimations();
        }, 1000);
    },
    
    // 获取用户名
    getUserName(uid) {
        try {
            // 这里使用B站Space API获取用户名
            // 注意：在实际应用中，您可能需要在服务器端实现这个功能
            // 目前使用一个占位
            this.elements.nameElement.textContent = `B站用户 (UID: ${uid})`;
            
            // 获取一个默认头像或B站Logo
            this.elements.avatarElement.src = 'images/bilibili-logo.png'; // 使用本地图片
            this.elements.avatarElement.onerror = function() {
                // 如果本地图片加载失败，使用B站默认图片
                this.src = 'https://i0.hdslb.com/bfs/archive/4de86ebf7f463781a96337c23f767f53b65e30c1.png';
            };
        } catch (error) {
            console.error('获取用户名失败:', error);
            this.elements.nameElement.textContent = `未知用户 (UID: ${uid})`;
        }
    },
    
    // 设置加载状态
    setLoadingState() {
        this.clearAnimations();
        this.elements.followerElement.textContent = '加载中...';
        this.elements.followingElement.textContent = '加载中...';
        this.elements.nameElement.textContent = '加载中...';
    },
    
    // 设置错误状态
    setErrorState(message) {
        this.clearAnimations();
        this.elements.followerElement.textContent = '获取失败';
        this.elements.followingElement.textContent = '获取失败';
        this.elements.nameElement.innerHTML = message || '连接服务器失败';
        
        // 在控制台输出详细错误信息
        console.error('API连接错误:', message);
    },
    
    // 清除动画效果
    clearAnimations() {
        this.elements.followerElement.classList.remove('number-updated');
        this.elements.followingElement.classList.remove('number-updated');
    },
    
    // 格式化数字，添加千位分隔符
    formatNumber(num) {
        if (!num && num !== 0) return "--";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

// 在DOM加载完成后初始化UI
document.addEventListener('DOMContentLoaded', function() {
    BilibiliUI.init();
}); 