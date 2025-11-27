<template>
  <div class="soso-compress-pack-page">
    <h1>婚礼照片压缩打包</h1>
    <!-- ① 参数区 -->
    <div class="params">
      <label>
        最大宽度（px）：
        <input
          type="number"
          v-model.number="maxWidth"
          min="400"
          max="4000"
          step="100"
        />
      </label>
      <label>
        质量：
        <input
          type="range"
          v-model.number="quality"
          min="0.1"
          max="1"
          step="0.1"
        />
        <span>{{ quality.toFixed(1) }}</span>
      </label>
    </div>

    <!-- ② 上传区 -->
    <div class="upload" @drop.prevent="onDrop" @dragover.prevent>
      <p>
        拖拽图片到此处 或
        <input type="file" multiple accept="image/*" @change="onSelect" />
      </p>
    </div>

    <div class="preview-area" v-if="list.length">
      <div v-for="(item, i) in list" :key="i" class="img-card">
        <img :src="item.url" />
        <div class="info">
          <div>{{ item.name }}</div>
          <div class="size">
            {{ kb(item.blobOld.size) }} → {{ kb(item.blobNew.size) }}
          </div>
          <div class="saved">
            节省 {{ savedPercent(item.blobOld.size, item.blobNew.size) }}%
          </div>
        </div>
      </div>
    </div>
    <div class="pack" v-if="list.length">
      <button @click="packZip">一键打包下载</button>
    </div>
    <transition name="fade">
      <div v-if="showTip" class="tip">压缩包已生成-并下载！</div>
    </transition>
  </div>
</template>

<script>
import JSZip from "jszip";
import { saveAs } from "file-saver";
export default {
  name: "WedCompressPack",
  data() {
    return {
      maxWidth: 2000,
      quality: 0.85,
      list: [],
      showTip: false
    };
  },
  methods: {
    onSelect(e) {
      this.addFiles([...e.target.files]);
    },
    onDrop(e) {
      this.addFiles([...e.dataTransfer.files]);
    },
    addFiles(files) {
      files
        .filter((f) => f.type.startsWith("image"))
        .forEach((file) => {
          const url = URL.createObjectURL(file);
          this.compress(file).then((blobNew) => {
            this.list.push({
              url,
              blobOld: file,
              blobNew,
              name: file.name.replace(/\.\w+$/, ".jpg")
            });
          });
        });
    },
    compress(file) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          const [w, h] =
            img.width > img.height
              ? [this.maxWidth, (this.maxWidth * img.height) / img.width]
              : [(this.maxWidth * img.width) / img.height, this.maxWidth];
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          canvas.toBlob(resolve, "image/jpeg", this.quality);
        };
      });
    },
    async packZip() {
      const zip = new JSZip();
      this.list.forEach((item, i) =>
        zip.file(`wed_${i + 1}.jpg`, item.blobNew)
      );
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `wedding_pics_${Date.now()}.zip`);
      this.showTip = true;
      setTimeout(() => (this.showTip = false), 2000);
    },
    kb(size) {
      return (size / 1024).toFixed(1) + " KB";
    },
    savedPercent(oldSz, newSz) {
      return Math.round((1 - newSz / oldSz) * 100);
    }
  }
};
</script>

<style scoped lang="less">
.soso-compress-pack-page {
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
  .params {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-bottom: 20px;
  }
  .params label {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #6c757d;
  }
  .params input[type="number"] {
    width: 80px;
  }
  .params input[type="range"] {
    flex: 1;
    margin: 0 8px;
  }
  .upload {
    border: 2px dashed #f8bbd0;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    background: #fce4ec;
  }
  .upload p {
    margin: 0;
    font-size: 14px;
    color: #6c757d;
  }
  .preview-area {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
    margin: 20px 0;
  }
  .img-card {
    background: #fff;
    border: 1px solid #f8bbd0;
    border-radius: 8px;
    overflow: hidden;
    padding: 8px;
  }
  .img-card img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
  }
  .info {
    padding: 6px 0;
    font-size: 13px;
    color: #495057;
  }
  .size {
    font-weight: bold;
    color: #d63384;
  }
  .saved {
    color: #28a745;
    font-size: 12px;
  }
  .pack {
    text-align: center;
  }
  .pack button {
    padding: 12px 28px;
    font-size: 16px;
    color: #fff;
    background: #d63384;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .tip {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #28a745;
    color: #fff;
    padding: 8px 16px;
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
