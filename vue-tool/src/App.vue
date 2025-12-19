<template>
  <div id="app">
    <h1>前端开发辅助工具集</h1>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card shadow="never" body-style="padding:12px;">
          <div class="tool-menu">
            <div
              v-for="(tool, index) in tools"
              :key="index"
              class="tool-item"
              :class="{ active: current === index }"
              @click="current = index"
            >
              <el-icon><Operation /></el-icon>
              <span>{{ tool.name }}</span>
              <el-badge v-if="index === 0" :value="hot" class="item-badge" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
        <component :is="tools[current].component" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ToolLineCount from "./components/ToolLineCount.vue";
import ToolImageCompress from "./components/ToolImageCompress.vue";
import ToolPasteImage from "./components/ToolPasteImage.vue";
import ToolColorPicker from "./components/ToolColorPicker.vue";
import ToolJsonEditor from "./components/ToolJsonEditor.vue";
import DocToPdf from "./components/DocToPdf.vue";
import ExcelToJson from "./components/ExcelToJson.vue";

export default {
  name: "App",
  data() {
    return {
      current: 0,
      hot: "",
      tools: [
        { name: "代码行数统计", component: "ToolLineCount" },
        { name: "图片压缩打包", component: "ToolImageCompress" },
        { name: "剪贴板粘贴保存", component: "ToolPasteImage" },
        { name: "屏幕取色器", component: "ToolColorPicker" },
        { name: "JSON 编辑器", component: "ToolJsonEditor" },
        { name: "Doc转Pdf", component: "DocToPdf" },
        { name: "Excel转Json", component: "ExcelToJson" }
      ]
    };
  },
  components: {
    ToolLineCount,
    ToolImageCompress,
    ToolPasteImage,
    ToolColorPicker,
    ToolJsonEditor,
    DocToPdf,
    ExcelToJson
  }
};
</script>

<style lang="less" scoped>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  .soso-form {
    .el-button {
      min-width: 200px;
    }
  }
  .tool-menu .tool-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .tool-menu .tool-item:hover {
    background: #f5f7fa;
  }
  .tool-menu .tool-item.active {
    background: #fff5f7;
    color: #d63384;
    font-weight: bold;
  }
  .tool-menu .tool-item .el-icon {
    margin-right: 8px;
    font-size: 16px;
  }
  .item-badge {
    margin-left: auto;
  }
}
</style>
