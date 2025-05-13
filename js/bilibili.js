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
    
    // 默认的B站UID（B站官方账号）
    let currentUid = '2';
    
    // API服务器URL - 可以根据需要修改
    const API_SERVER = 'http://localhost:3000';
    
    // 格式化数字，添加千位分隔符
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // 获取B站用户信息
    async function fetchBilibiliUserInfo(uid) {
        try {
            // 使用独立的API服务器获取数据
            const response = await fetch(`${API_SERVER}/api/bilibili-fans?uid=${uid}`);
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
                    followerElement.classList.remove('number-updated');
                    followingElement.classList.remove('number-updated');
                }, 1000);
                
                return true;
            } else {
                throw new Error(data.message || '获取数据失败');
            }
        } catch (error) {
            console.error('获取B站数据出错:', error);
            followerElement.textContent = '获取失败';
            followingElement.textContent = '获取失败';
            nameElement.textContent = `连接API服务器失败: ${error.message}`;
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
            avatarElement.src = 'https://i0.hdslb.com/bfs/archive/4de86ebf7f463781a96337c23f767f53b65e30c1.png';
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
        
        // 显示加载状态
        followerElement.textContent = '加载中...';
        followingElement.textContent = '加载中...';
        nameElement.textContent = '加载中...';
        
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