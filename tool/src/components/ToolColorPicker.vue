<template>
  <div class="soso-color-picker-page">
    <!-- ① 标题 -->
    <h1>婚礼配色取色器</h1>

    <!-- ② 操作区 -->
    <div class="operate">
      <button class="pick-btn" @click="pickColor">点击取色</button>
      <div class="result">
        <span class="label">当前色值：</span>
        <input class="color-input" :value="color" readonly />
        <button class="copy-btn" @click="copyColor(color)">复制</button>
        <span class="preview" :style="{ background: color }"></span>
      </div>
    </div>

    <!-- ③ 历史区 -->
    <div class="history" v-if="history.length">
      <h3>最近取色</h3>
      <ul>
        <li v-for="(c, i) in history" :key="i" @click="copy(c)">
          <span class="hist-color" :style="{ background: c.hex }"></span>
          <span class="hist-hex">{{ c.hex }}</span>
          <span class="hist-time">{{ c.time }}</span>
        </li>
      </ul>
    </div>

    <!-- ④ 降级提示 -->
    <div v-if="!support" class="fallback">
      您的浏览器不支持 EyeDropper，请使用 Chrome/Edge 86+ 或长按图片取色。
    </div>

    <!-- ⑤ 复制提示 -->
    <transition name="fade">
      <div v-if="showTip" class="tip">已复制到剪贴板</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ColorPicker",
  data() {
    return {
      color: "",
      history: JSON.parse(localStorage.getItem("wed_colors") || "[]"),
      showTip: false,
      support: !!window.EyeDropper
    };
  },
  methods: {
    async pickColor() {
      if (!this.support) return;
      const { sRGBHex } = await new EyeDropper().open();
      this.color = sRGBHex;
      this.history.unshift({
        hex: sRGBHex,
        time: new Date().toLocaleTimeString()
      });
      this.history = this.history.slice(0, 12);
      localStorage.setItem("wed_colors", JSON.stringify(this.history));
    },
    copy(txt) {
      navigator.clipboard.writeText(txt || this.color);
      this.showTip = true;
      setTimeout(() => (this.showTip = false), 1500);
    },
    async copyColor(color) {
      console.log("color", color);
      try {
        await navigator.clipboard.writeText(color);
        this.$message.success("已复制 " + color);
      } catch (e) {
        // 降级：用老办法
        const ta = document.createElement("textarea");
        ta.value = color;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        this.$message.success("已复制 " + color);
      }
    }
  }
};
</script>

<style scoped lang="less">
.soso-color-picker-page {
  max-width: 1000px;
  padding: 20px;
  font-family: Arial;
  h1 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
  }
  .operate {
    background: #f7f7f7;
    padding: 15px;
    border-radius: 8px;
  }
  .pick-btn {
    width: 100%;
    height: 48px;
    font-size: 18px;
    color: #fff;
    background: #d63384;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .result {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }
  .color-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 0 8px;
  }
  .copy-btn {
    padding: 8px 12px;
    background: #6c757d;
    color: #fff;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .preview {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-left: 8px;
  }
  .history {
    margin-top: 25px;
  }
  .history ul {
    list-style: none;
    padding: 0;
  }
  .history li {
    display: flex;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  .hist-color {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    margin-right: 10px;
  }
  .hist-hex {
    flex: 1;
    font-family: Consolas;
  }
  .hist-time {
    font-size: 12px;
    color: #999;
  }
  .tip {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #28a745;
    color: #fff;
    padding: 6px 12px;
    border-radius: 4px;
  }
  .fallback {
    margin-top: 20px;
    color: #dc3545;
    font-size: 14px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
