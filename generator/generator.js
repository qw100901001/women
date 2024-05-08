// 设置font-size
(function () {
    const setFontSize = () => {
        // 获取窗口宽度
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // 定义基准宽度（例如1920px）
        const baseWidth = 1920;

        // 定义基准字体大小
        const baseFontSize = 100;

        // 计算相对于基准宽度的缩放比例
        const scale = windowWidth / baseWidth;

        // 计算相对于基准字体大小的REM单位
        const rootFontSize = baseFontSize * scale;
        // 设置根元素的字体大小
        document.documentElement.style.fontSize = rootFontSize + 'px';
    }
    // 添加窗口大小调整事件的监听器
    if (window.addEventListener) {
        // 现代浏览器
        window.addEventListener('resize', function () {
            setFontSize()
        });
    } else if (window.attachEvent) {
        // 适用于IE8及更早版本的浏览器
        window.attachEvent('onresize', function () {
            setFontSize()
        });
    } else {
        // 如果两者都不支持，则退而求其次，使用onresize属性
        window.onresize = function () {
            setFontSize()
        };
    }
    setFontSize();
})()