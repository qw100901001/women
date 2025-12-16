// 设计稿的基准宽度
const designWidth = 390;
// 将设计稿宽度分成 10 等份，作为基准值
const baseFontSize = 100;

// 计算并设置根元素字体大小的函数
function setRemUnit() {
    // 获取当前视口的宽度（处理移动端的横竖屏切换）
    const clientWidth = document.documentElement.clientWidth || window.innerWidth;
    // 限制最小宽度（可选，防止小屏幕下字体过小）
    const width = Math.max(clientWidth, 390);
    // 计算当前屏幕下的根字体大小
    const rem = (width / designWidth) * baseFontSize;
    // 设置 html 标签的字体大小
    document.documentElement.style.fontSize = `${rem}px`;
    console.log("rem", rem)
}

// 初始化执行一次
setRemUnit();
// 监听窗口大小变化时重新计算
window.addEventListener('resize', setRemUnit);
// 监听屏幕旋转（移动端）时重新计算
window.addEventListener('orientationchange', setRemUnit);