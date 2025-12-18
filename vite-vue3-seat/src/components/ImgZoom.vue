<template>
  <!-- 图片缩放容器：可自定义宽高，溢出隐藏 -->
  <div
    class="img-zoom-container"
    :style="{ width: containerWidth, height: containerHeight }"
    ref="containerRef"
  >
    <!-- 可缩放拖拽的图片 -->
    <img
      class="zoom-img"
      :src="src"
      :alt="alt"
      ref="imgRef"
      :style="{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transition: isGesturing ? 'none' : 'transform 0.1s ease'
      }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 手动引入Hammer.js的核心逻辑（避免npm包依赖问题，直接内嵌关键代码）
class HammerGesture {
  constructor(el) {
    this.el = el;
    this.pinchEnabled = false;
    this.panEnabled = false;
    this.onPinch = null;
    this.onPan = null;
    this.onGestureStart = null;
    this.onGestureEnd = null;
    this.initTouchEvents();
  }

  // 初始化触摸事件
  initTouchEvents() {
    let touch1 = null;
    let touch2 = null;
    let startDistance = 0;
    let startX = 0;
    let startY = 0;
    let isGesturing = false;

    // 触摸开始
    this.el.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touches = e.touches;
      if (touches.length === 1 && this.panEnabled) {
        isGesturing = true;
        startX = touches[0].clientX;
        startY = touches[0].clientY;
        this.onGestureStart && this.onGestureStart();
      } else if (touches.length === 2 && this.pinchEnabled) {
        isGesturing = true;
        touch1 = touches[0];
        touch2 = touches[1];
        startDistance = this.getDistance(touch1, touch2);
        this.onGestureStart && this.onGestureStart();
      }
    });

    // 触摸移动
    this.el.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const touches = e.touches;
      if (touches.length === 1 && this.panEnabled && isGesturing) {
        const deltaX = touches[0].clientX - startX;
        const deltaY = touches[0].clientY - startY;
        this.onPan && this.onPan({ deltaX, deltaY });
        startX = touches[0].clientX;
        startY = touches[0].clientY;
      } else if (touches.length === 2 && this.pinchEnabled && isGesturing) {
        const newTouch1 = touches[0];
        const newTouch2 = touches[1];
        const currentDistance = this.getDistance(newTouch1, newTouch2);
        const scale = currentDistance / startDistance;
        this.onPinch && this.onPinch({ scale });
        startDistance = currentDistance;
      }
    });

    // 触摸结束
    this.el.addEventListener("touchend", () => {
      if (isGesturing) {
        isGesturing = false;
        this.onGestureEnd && this.onGestureEnd();
      }
    });
  }

  // 计算两指距离
  getDistance(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 启用捏合
  enablePinch() {
    this.pinchEnabled = true;
  }

  // 启用拖拽
  enablePan() {
    this.panEnabled = true;
  }

  // 绑定事件
  on(event, callback) {
    if (event === "pinch") this.onPinch = callback;
    if (event === "pan") this.onPan = callback;
    if (event === "gestureStart") this.onGestureStart = callback;
    if (event === "gestureEnd") this.onGestureEnd = callback;
  }

  // 销毁
  destroy() {
    this.el.removeEventListener("touchstart", null);
    this.el.removeEventListener("touchmove", null);
    this.el.removeEventListener("touchend", null);
  }
}

// 组件Props配置
const props = defineProps({
  // 图片地址（必传）
  src: {
    type: String,
    required: true
  },
  // 图片替代文本
  alt: {
    type: String,
    default: "可缩放图片"
  },
  // 最小缩放比例
  minScale: {
    type: Number,
    default: 1
  },
  // 最大缩放比例
  maxScale: {
    type: Number,
    default: 3
  },
  // 容器宽度
  containerWidth: {
    type: String,
    default: "100%"
  },
  // 容器高度
  containerHeight: {
    type: String,
    default: "400px"
  }
});

// 响应式变量
const imgRef = ref(null);
const containerRef = ref(null);
const scale = ref(1); // 当前缩放比例
const lastScale = ref(1); // 上一次缩放比例
const x = ref(0); // 图片X轴偏移
const y = ref(0); // 图片Y轴偏移
const isGesturing = ref(false); // 是否正在手势操作
let gestureManager = null; // 手势管理器实例

// 初始化手势识别
const initGesture = () => {
  if (!imgRef.value) return;
  // 创建手势实例
  gestureManager = new HammerGesture(imgRef.value);
  // 启用捏合和拖拽
  gestureManager.enablePinch();
  gestureManager.enablePan();
  // 绑定手势事件
  gestureManager.on("gestureStart", () => {
    isGesturing.value = true;
    lastScale.value = scale.value;
  });
  // 捏合缩放
  gestureManager.on("pinch", (e) => {
    const newScale = Math.max(
      props.minScale,
      Math.min(lastScale.value * e.scale, props.maxScale)
    );
    scale.value = newScale;
    lastScale.value = newScale;
  });
  // 拖拽移动
  gestureManager.on("pan", (e) => {
    x.value += e.deltaX;
    y.value += e.deltaY;
  });
  // 手势结束
  gestureManager.on("gestureEnd", () => {
    isGesturing.value = false;
  });
};

// 销毁手势实例
const destroyGesture = () => {
  if (gestureManager) {
    gestureManager.destroy();
    gestureManager = null;
  }
};

// 组件生命周期
onMounted(() => {
  // 图片加载完成后初始化手势
  if (imgRef.value) {
    imgRef.value.onload = initGesture;
  } else {
    initGesture();
  }
});

onUnmounted(() => {
  // 组件卸载时销毁手势，防止内存泄漏
  destroyGesture();
});
</script>

<style scoped>
/* 容器样式：相对定位，溢出隐藏，禁用浏览器默认触控行为 */
.img-zoom-container {
  position: relative;
  overflow: hidden;
  /* border: 1px solid #eee; */
  touch-action: none; /* 关键：禁用浏览器默认触控行为，避免冲突 */
  height: 100% !important;
}

/* 图片样式：绝对定位，初始居中，禁止选中 */
.zoom-img {
  position: absolute;
  top: 0%;
  left: 0%;
  transform: translate(-50%, -50%) scale(1);
  user-select: none; /* 禁止图片被长按选中 */
  transform-origin: center center; /* 缩放原点为图片中心 */
  max-width: 100%; /* 初始图片不超出容器 */
}
</style>
