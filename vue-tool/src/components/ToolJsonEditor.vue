<template>
  <div class="soso-editor-content">
    <h3 style="text-align: center">本地 JSON 编辑器（婚庆预算示例）</h3>
    <el-button @click="openFile">选择 JSON</el-button>
    <el-button @click="saveFile" :disabled="!fileHandle"
      >保存到本地磁盘</el-button
    >
    <div class="soso-tree">
      <json-node :data="jsonData" @update="onUpdate" />
    </div>

    <pre class="soso-preview">{{ JSON.stringify(jsonData, null, 2) }}</pre>
  </div>
</template>

<script>
import JsonNode from "../components/JsonNode.vue";
// 递归组件：渲染任意层级
export default {
  name: "ToolJson",
  props: ["data"],
  methods: {
    onUpdate() {
      this.$emit("update");
    }
  },
  components: { JsonNode },
  data() {
    return { jsonData: null, fileHandle: null };
  },
  methods: {
    async openFile(e) {
      // File System Access API 打开文件
      [this.fileHandle] = await window.showOpenFilePicker({
        types: [{ accept: { "application/json": [".json"] } }]
      });
      const file = await this.fileHandle.getFile();
      const text = await file.text();
      this.jsonData = JSON.parse(text);
    },
    async saveFile() {
      if (!this.fileHandle) return;
      const writable = await this.fileHandle.createWritable();
      await writable.write(JSON.stringify(this.jsonData, null, 2));
      await writable.close();
      alert("已保存到本地磁盘！");
    },
    onUpdate() {
      // 数据已就地修改，保存时直接写回
    }
  }
};
</script>

<style scoped lang="less">
.soso-editor-content {
  text-align: left;
  background-color: #fff5f7;
  padding: 20px;
  max-width: 1000px;
  h3 {
    color: #d63384;
    font-size: 26px;
  }
  .soso-tree {
    background: #f6f6f6;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
  }
  .item {
    margin: 4px 0;
  }
  .key {
    display: inline-block;
    width: 140px;
    font-weight: bold;
  }
  input,
  select {
    width: 200px;
  }
  .preview {
    background: #eef;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
    max-height: 300px;
  }
}
</style>
