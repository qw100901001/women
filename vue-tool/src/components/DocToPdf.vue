<template>
  <div class="soso-wed-box">
    <h1>婚庆小工具：DOCX → PDF</h1>

    <!-- 选文件 -->
    <input type="file" accept=".docx" @change="pickDoc" />

    <!-- 预览区：内容里可插分页/防断类名 -->
    <div ref="print" class="preview" v-show="html"></div>

    <!-- 下载 -->
    <el-button
      type="danger"
      :loading="loading"
      :disabled="!html"
      @click="makePdf"
    >
      下载 PDF 喜帖
    </el-button>

    <!-- 错误提示 -->
    <el-alert v-if="err" :title="err" type="error" show-icon />
  </div>
</template>

<script>
/* 依赖安装：npm i mammoth html2pdf.js -S */
import mammoth from "mammoth";
import html2pdf from "html2pdf.js";

export default {
  name: "DocToPdf",
  data() {
    return {
      html: "", // 预览 HTML
      loading: false,
      err: ""
    };
  },
  methods: {
    /* 1. 读取并转换 docx → html */
    async pickDoc(e) {
      this.err = "";
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const buf = await file.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer: buf });
        this.html = value;
        this.$refs.print.innerHTML = this.html;
      } catch (e) {
        this.err = "转换失败：" + e.message;
      }
    },

    /* 2. html → pdf：带分页策略，防止字体被裁 */
    async makePdf() {
      if (!this.html) return;
      this.loading = true;

      const opt = {
        margin: 0,
        filename: `婚庆喜帖_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        /* 关键：启用 css 分页 + 兼容老模式 */
        pagebreak: { mode: ["css", "legacy"], avoid: [".pb-avoid"] }
      };

      try {
        await html2pdf().set(opt).from(this.$refs.print).save();
      } catch (e) {
        this.err = "生成 PDF 失败：" + e.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
/* 整体喜庆色调 */
/* 可视容器：完全等于 A4 纸尺寸 */
.soso-wed-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  input {
    margin-bottom: 20px;
  }
  .preview {
    position: relative;
    width: 210mm; /* 纸宽 */
    min-height: 297mm; /* 纸高 */
    margin: 20px auto; /* 居中 */
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    /* 内容用 padding 留边，不再撑大容器 */
    padding: 25mm 20mm 25mm 20mm; /* 上 右 下 左 */
    box-sizing: border-box; /* 关键：padding 算在 210mm 内 */
    line-height: 1.8;
  }

  /* 如果 Word 里插了图片，防止溢出 */
  .preview img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* 分页控制保持原样 */
  .pb-before {
    page-break-before: always;
  }
  .pb-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
