<template>
  <div class="soso-wed-paste-page">
    <!-- 文件上传控件：只允许选择xlsx格式的文件 -->
    <h1>excel-to-json</h1>
    <input
      type="file"
      accept=".xlsx, .xls"
      @change="handleFileChange"
      class="file-input"
    />
  </div>
</template>

<script>
// 引入xlsx库
import XLSX from "xlsx";

export default {
  name: "ExcelToJson",
  data() {
    return {
      jsonData: [] // 存储解析后的JSON数据
    };
  },
  methods: {
    /**
     * 处理文件选择事件
     * @param {Event} e - 文件选择事件
     */
    handleFileChange(e) {
      // 获取选中的文件
      const file = e.target.files[0];
      if (!file) {
        return;
      }

      // 校验文件格式（只处理xlsx和xls）
      const fileType = file.name.split(".").pop().toLowerCase();
      if (fileType !== "xlsx" && fileType !== "xls") {
        alert("请选择xlsx或xls格式的Excel文件！");
        // 清空文件选择框
        e.target.value = "";
        return;
      }

      // 创建FileReader读取文件
      const reader = new FileReader();
      // 以二进制方式读取文件
      reader.readAsArrayBuffer(file);

      // 读取完成后的回调
      reader.onload = (event) => {
        try {
          // 获取文件的二进制数据
          const data = new Uint8Array(event.target.result);
          // 解析Excel文件
          const workbook = XLSX.read(data, { type: "array" });

          // 处理Excel数据：默认取第一个工作表
          this.handleWorkbook(workbook);

          // 清空文件选择框，方便再次选择
          e.target.value = "";
        } catch (error) {
          console.error("Excel解析失败：", error);
          alert("Excel文件解析失败，请检查文件是否损坏！");
          e.target.value = "";
        }
      };

      // 读取失败的回调
      reader.onerror = () => {
        alert("文件读取失败，请重试！");
        e.target.value = "";
      };
    },

    /**
     * 处理解析后的Excel工作簿，转换为JSON
     * @param {Object} workbook - xlsx解析后的工作簿对象
     */
    handleWorkbook(workbook) {
      // 获取第一个工作表的名称
      const sheetName = workbook.SheetNames[0];
      // 获取工作表数据
      const worksheet = workbook.Sheets[sheetName];

      /**
       * 将工作表转换为JSON
       * header: 1 表示以第一行作为表头，生成的JSON是对象数组（推荐）
       * 若设置 header: null，则生成的是二维数组
       */
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // 处理表头和数据（可选：如果需要将第一行作为key，后续行作为value）
      if (jsonData.length > 0) {
        const header = jsonData[0]; // 表头行
        const result = [];
        // 遍历数据行（从第二行开始）
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const obj = {};
          // 遍历每一列，将表头作为key，单元格内容作为value
          header.forEach((key, index) => {
            obj[key] = row[index] || "";
          });
          result.push(obj);
        }
        this.jsonData = result;
        const guestData = this.jsonData.reduce((cur, next) => {
          cur.push({
            name: next["宾客名称"],
            value: next["桌号"]
          });
          return cur;
        }, []);
        this.downloadData(guestData);
      } else {
        this.jsonData = [];
        alert("Excel文件中没有数据！");
      }
    },
    downloadData(data) {
      try {
        // 1. 将JSON对象转换为字符串（格式化后更易读，空格为2）
        const jsonStr = JSON.stringify(data, null, 2);
        // 2. 创建Blob对象，指定文件类型为json
        const blob = new Blob([jsonStr], {
          type: "application/json; charset=utf-8"
        });
        // 3. 创建临时的a标签用于下载
        const a = document.createElement("a");
        // 4. 生成Blob的URL地址
        const url = URL.createObjectURL(blob);
        // 5. 设置下载的文件名（可自定义，比如excel-data.json）
        a.download = "excel-to-json.json";
        // 6. 绑定URL到a标签
        a.href = url;
        // 7. 触发点击（模拟用户点击下载链接）
        a.click();
        // 8. 释放Blob URL资源，避免内存泄漏
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("JSON文件下载失败：", error);
        alert("JSON文件下载失败，请重试！");
      }
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
  display: flex;
  flex-direction: column;
  h1 {
    text-align: left;
    font-size: 26px;
    color: #d63384;
    margin-bottom: 20px;
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
