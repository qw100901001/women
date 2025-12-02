<template>
  <div class="soso-wed-paste-page">
    <h1>婚礼图片剪贴板</h1>
    <!-- ① 操作区 -->
    <div class="operate">
      <p>按 <kbd>Ctrl</kbd> + <kbd>V</kbd> 或右键“粘贴”即可上传截图</p>
      <button @click="saveAll" :disabled="images.length === 0">
        保存全部到本地
      </button>
    </div>
    <!-- ② 预览区 -->
    <div class="preview-area">
      <div v-for="(img, i) in images" :key="i" class="img-card">
        <img :src="img.url" />
        <button class="del" @click="images.splice(i, 1)">×</button>
      </div>
    </div>
    <!-- ③ 不支持降级 -->
    <div v-if="!support" class="fallback">
      您的浏览器不支持本地保存，请使用 Chrome/Edge 86+ 并重试。
    </div>
    <!-- ④ 成功提示 -->
    <transition name="fade">
      <div v-if="showTip" class="tip">已保存到磁盘！</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "WedPasteSave",
  data() {
    return {
      images: [],
      showTip: false,
      support: !!window.showDirectoryPicker,
      dirHandle: null
    };
  },
  mounted() {
    // 监听全局粘贴
    document.addEventListener("paste", this.onPaste);
  },
  beforeDestroy() {
    document.removeEventListener("paste", this.onPaste);
  },
  methods: {
    onPaste(e) {
      const items = [...e.clipboardData.items];
      const imgItem = items.find((i) => i.type.startsWith("image"));
      if (!imgItem) return;
      const blob = imgItem.getAsFile();
      const url = URL.createObjectURL(blob);
      this.images.push({ blob, url });
    },
    async saveAll() {
      if (!this.support) return;
      if (!this.dirHandle) {
        this.dirHandle = await window.showDirectoryPicker();
      }
      let idx = 1;
      for (const { blob } of this.images) {
        const fileHandle = await this.dirHandle.getFileHandle(
          `wed_${idx++}.png`,
          { create: true }
        );
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      }
      this.showTip = true;
      setTimeout(() => (this.showTip = false), 1500);
    }
  }
};
</script>

<style scoped lang="less">
.soso-wed-paste-page {
  max-width: 1000px;
  padding: 20px;
  font-family: "Segoe UI", Arial;
  background: #fff5f7;
  h1 {
    text-align: center;
    font-size: 26px;
    color: #d63384;
    margin-bottom: 20px;
  }
  .operate {
    text-align: center;
    background: #fce4ec;
    padding: 15px;
    border-radius: 8px;
  }
  .operate p {
    margin: 0 0 10px;
    font-size: 14px;
    color: #6c757d;
  }
  .operate button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background: #d63384;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .operate button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  .preview-area {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }
  .img-card {
    position: relative;
    width: 148px;
    height: 148px;
    border: 2px solid #f8bbd0;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }
  .img-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .img-card .del {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }
  .fallback {
    margin-top: 15px;
    color: #dc3545;
    font-size: 13px;
    text-align: center;
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
