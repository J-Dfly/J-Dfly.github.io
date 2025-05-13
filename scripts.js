/**
 * 飞哥网站 - 交互功能脚本
 */

// 等待DOM内容完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // ---- 图片显示/隐藏功能 ----
    const toggleBtn = document.getElementById('toggleImageBtn');
    const toggleBtnText = toggleBtn.querySelector('.button-text');
    const imageContainer = document.getElementById('imageContainer');
    
    // 为切换按钮添加点击事件监听器
    toggleBtn.addEventListener('click', function() {
        // 切换图片显示状态
        if (imageContainer.style.display === 'none') {
            imageContainer.style.display = 'block';
            toggleBtnText.textContent = '隐藏图片展示';
            toggleBtn.classList.add('active');
        } else {
            imageContainer.style.display = 'none';
            toggleBtnText.textContent = '查看图片展示';
            toggleBtn.classList.remove('active');
        }
        
        // 将当前显示状态保存到本地存储中
        localStorage.setItem('imageDisplay', imageContainer.style.display);
    });
    
    // 检查本地存储中的显示状态并应用
    const savedDisplay = localStorage.getItem('imageDisplay');
    if (savedDisplay === 'none') {
        imageContainer.style.display = 'none';
        toggleBtnText.textContent = '查看图片展示';
        toggleBtn.classList.remove('active');
    } else {
        imageContainer.style.display = 'block';
        toggleBtnText.textContent = '隐藏图片展示';
        toggleBtn.classList.add('active');
    }

    // ---- 轮播图功能 ----
    // 获取轮播图相关元素
    const slidesWrapper = document.querySelector('.slides-wrapper');
    let slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.querySelector('.slide-indicators');
    let indicators = document.querySelectorAll('.indicator');
    
    // 处理只有一张图片的情况
    if (slides.length === 1) {
        // 复制这张图片两次，创建三张相同的图片来实现轮播效果
        const originalSlide = slides[0];
        const clone1 = originalSlide.cloneNode(true);
        const clone2 = originalSlide.cloneNode(true);
        
        // 移除active类，只保留原始幻灯片的active
        clone1.classList.remove('active');
        clone2.classList.remove('active');
        
        // 为克隆幻灯片添加不同的标识
        clone1.setAttribute('data-clone', '1');
        clone2.setAttribute('data-clone', '2');
        
        // 添加到幻灯片容器
        slidesWrapper.appendChild(clone1);
        slidesWrapper.appendChild(clone2);
        
        // 为指示器容器添加两个指示器
        for (let i = 1; i <= 2; i++) {
            const newIndicator = document.createElement('span');
            newIndicator.classList.add('indicator');
            newIndicator.setAttribute('data-index', i);
            indicatorsContainer.appendChild(newIndicator);
        }
        
        // 更新slides和indicators变量
        slides = document.querySelectorAll('.slide');
        indicators = document.querySelectorAll('.indicator');
    }
    
    // 当前幻灯片索引
    let currentSlideIndex = 0;
    let previousSlideIndex = 0;
    
    // 自动轮播计时器
    let slideshowInterval;
    // 是否正在进行动画
    let isAnimating = false;
    
    // 显示特定索引的幻灯片，带动画效果
    function showSlide(index) {
        // 如果正在动画中，不处理
        if (isAnimating) return;
        
        isAnimating = true;
        
        // 处理索引边界情况
        if (index >= slides.length) {
            index = 0;
        } else if (index < 0) {
            index = slides.length - 1;
        }
        
        // 保存前一个幻灯片索引
        previousSlideIndex = currentSlideIndex;
        
        // 确定动画方向
        const isNext = index > previousSlideIndex || 
                        (previousSlideIndex === slides.length - 1 && index === 0);
        const isPrev = !isNext;
        
        // 移除所有动画类
        slides.forEach(slide => {
            slide.classList.remove('slide-animation', 'slide-in-right', 'slide-in-left', 
                                   'slide-out-right', 'slide-out-left');
        });
        
        // 获取当前和下一个幻灯片元素
        const currentSlide = slides[previousSlideIndex];
        const nextSlide = slides[index];
        
        // 设置退出动画
        if (isNext) {
            currentSlide.classList.add('slide-animation', 'slide-out-left');
        } else {
            currentSlide.classList.add('slide-animation', 'slide-out-right');
        }
        
        // 延迟设置入场动画，使两个动画不完全重叠
        setTimeout(() => {
            // 隐藏所有幻灯片并移除活动指示器
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // 显示下一个幻灯片
            nextSlide.classList.add('active');
            
            // 设置入场动画
            if (isNext) {
                nextSlide.classList.add('slide-animation', 'slide-in-right');
            } else {
                nextSlide.classList.add('slide-animation', 'slide-in-left');
            }
            
            // 更新指示器
            indicators[index].classList.add('active');
            
            // 更新当前索引
            currentSlideIndex = index;
            
            // 动画结束后重置isAnimating标志
            setTimeout(() => {
                isAnimating = false;
            }, 800); // 与CSS中的动画时间一致
        }, 50);
    }
    
    // 显示下一张幻灯片
    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }
    
    // 显示上一张幻灯片
    function prevSlide() {
        showSlide(currentSlideIndex - 1);
    }
    
    // 为导航按钮添加事件监听器
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetAutoSlideTimer(); // 重置自动轮播计时器
    });
    
    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetAutoSlideTimer(); // 重置自动轮播计时器
    });
    
    // 为指示器添加点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            // 防止点击当前已激活的指示器
            if (index !== currentSlideIndex) {
                showSlide(index);
                resetAutoSlideTimer(); // 重置自动轮播计时器
            }
        });
    });
    
    // 自动轮播功能
    function startAutoSlide() {
        // 每4秒切换一次幻灯片，给予更多时间观看动画
        slideshowInterval = setInterval(nextSlide, 8000);
    }
    
    // 重置自动轮播计时器
    function resetAutoSlideTimer() {
        clearInterval(slideshowInterval);
        startAutoSlide();
    }
    
    // 鼠标悬停在轮播图上时暂停自动轮播
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.addEventListener('mouseenter', function() {
        clearInterval(slideshowInterval);
    });
    
    // 鼠标离开轮播图时恢复自动轮播
    slideshowContainer.addEventListener('mouseleave', function() {
        startAutoSlide();
    });
    
    // 启动自动轮播
    startAutoSlide();
}); 