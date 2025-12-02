<template>
  <div class="soso-wed-linecount-page">
    <h1>婚礼项目代码行数统计</h1>

    <!-- ① 上传区 -->
    <div class="upload" @drop.prevent="onDrop" @dragover.prevent>
      <input type="file" webkitdirectory multiple @change="onSelect" />
      <p>或拖拽整个文件夹到此处</p>
    </div>

    <!-- ② 结果区 -->
    <div class="result-card" v-if="total.files">
      <div class="row">
        <span>文件数</span>
        <strong>{{ total.files }}</strong>
      </div>
      <div class="row">
        <span>总行数</span>
        <strong>{{ total.lines }}</strong>
      </div>
      <div class="row">
        <span>空行</span>
        <strong>{{ total.empty }}</strong>
      </div>
      <div class="row">
        <span>注释行</span>
        <strong>{{ total.comment }}</strong>
      </div>
      <div class="row">
        <span>代码行</span>
        <strong>{{ total.lines - total.empty - total.comment }}</strong>
      </div>
    </div>

    <!-- ③ 导出按钮 -->
    <div class="export" v-if="total.files">
      <button @click="exportCsv">导出 CSV</button>
    </div>

    <!-- ④ 文件明细 -->
    <details class="detail" v-if="files.length">
      <summary>点击查看文件明细</summary>
      <table>
        <thead>
          <tr>
            <th>文件</th>
            <th>总行</th>
            <th>空行</th>
            <th>注释</th>
            <th>代码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in files" :key="f.path">
            <td class="path">{{ f.path }}</td>
            <td>{{ f.lines }}</td>
            <td>{{ f.empty }}</td>
            <td>{{ f.comment }}</td>
            <td>{{ f.lines - f.empty - f.comment }}</td>
          </tr>
        </tbody>
      </table>
    </details>

    <!-- ⑤ 成功提示 -->
    <transition name="fade">
      <div v-if="showTip" class="tip">CSV 已下载！</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "WedLineCount",
  data() {
    return {
      total: { files: 0, lines: 0, empty: 0, comment: 0 },
      files: [], // 明细数组
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
    async addFiles(fileList) {
      const reg = /\.(js|ts|vue|html|css|less|scss)$/i;
      const arr = [];
      let tFiles = 0,
        tLines = 0,
        tEmpty = 0,
        tComment = 0;

      for (const f of fileList) {
        if (!reg.test(f.name)) continue;
        const text = await f.text();
        const lines = text.split("\n");
        const empty = lines.filter((l) => !l.trim()).length;
        const comment = lines.filter((l) => {
          const tmp = l.trim();
          return (
            tmp.startsWith("//") || tmp.startsWith("/*") || tmp.startsWith("*")
          );
        }).length;

        arr.push({
          path: f.name,
          lines: lines.length,
          empty,
          comment
        });

        tFiles++;
        tLines += lines.length;
        tEmpty += empty;
        tComment += comment;
      }

      this.files = arr;
      this.total = {
        files: tFiles,
        lines: tLines,
        empty: tEmpty,
        comment: tComment
      };
    },
    exportCsv() {
      const head = "文件,总行,空行,注释,代码\n";
      const body = this.files
        .map(
          (f) =>
            `${f.path},${f.lines},${f.empty},${f.comment},${
              f.lines - f.empty - f.comment
            }`
        )
        .join("\n");
      const csvContent = "\uFEFF" + head + body;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wed_project_lines.csv";
      a.click();
      this.showTip = true;
      setTimeout(() => (this.showTip = false), 1500);
    }
  }
};
</script>

<style scoped lang="less">
.soso-wed-linecount-page {
  max-width: 1000px;
  padding: 20px;
  background: #fff5f7;
  h1 {
    text-align: center;
    font-size: 26px;
    color: #d63384;
    margin-bottom: 20px;
  }
  .upload {
    border: 2px dashed #f8bbd0;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    background: #fce4ec;
  }
  .upload input {
    margin-bottom: 8px;
  }
  .upload p {
    margin: 0;
    font-size: 14px;
    color: #6c757d;
  }
  .result-card {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin: 20px 0;
    background: #fff;
    border: 1px solid #f8bbd0;
    border-radius: 8px;
    padding: 15px;
  }
  .result-card .row {
    text-align: center;
  }
  .result-card .row span {
    font-size: 13px;
    color: #6c757d;
  }
  .result-card .row strong {
    font-size: 20px;
    color: #d63384;
  }
  .export {
    text-align: center;
    margin-bottom: 15px;
  }
  .export button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background: #d63384;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }
  .detail {
    background: #fff;
    border: 1px solid #f8bbd0;
    border-radius: 8px;
    padding: 10px;
    margin-top: 10px;
  }
  .detail summary {
    cursor: pointer;
    font-weight: bold;
    color: #d63384;
  }
  .detail table {
    width: 100%;
    font-size: 13px;
    margin-top: 10px;
    border-collapse: collapse;
  }
  .detail th,
  .detail td {
    padding: 6px;
    border: 1px solid #f8bbd0;
    text-align: center;
  }
  .detail th {
    background: #fce4ec;
  }
  .detail .path {
    text-align: left;
    word-break: break-all;
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
