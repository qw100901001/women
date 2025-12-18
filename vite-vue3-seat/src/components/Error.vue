<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  errorMsg: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["close"]);
const handleClose = () => {
  emit("close");
};
</script>
<template>
  <div class="error-modal" v-if="visible">
    <div class="msg-content">
      <div class="row-tip">抱歉，未找到您的名称，可联系新郎</div>
      <div class="row-tip">海克同事/希乐曼店长：</div>
      <div class="store-manager">
        <div class="row-item">
          <span>梁毅(店长)：</span>
          <a href="tel:13570421456">13570421456</a>
        </div>
        <div class="row-item">
          <span>刘文君(海克同事)：</span>
          <a href="tel:13763315338">13763315338</a>
        </div>
        <div class="row-item">
          <span>梁华兴(海克同事)：</span>
          <a href="tel:15989137766">15989137766</a>
        </div>
        <div class="row-item">
          <span>林斯聪(海克同事)：</span>
          <a href="tel:15521469492">15521469492</a>
        </div>
      </div>
    </div>

    <div class="btn" @click="handleClose">好的</div>
  </div>
</template>

<style lang="less" scoped>
.error-modal {
  width: 2.8rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  color: #f9e5c4;
  font-size: 0.15rem;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  .msg-content {
    padding: 0.22rem 0.18rem 0;
    .row-tip {
      line-height: 1.5;
    }
    .store-manager {
      margin: 0.1rem 0 0.25rem 0;
      .row-item {
        display: flex;
        align-items: center;
        height: 0.4rem;
        a {
          color: #f9e5c4;
          text-decoration: none;
          font-family: "Microsoft Yahei", Helvetica, Arial, sans-serif;
          display: block;
          border-bottom: 1px solid #f9e5c4;
        }
      }
    }
  }
  .btn {
    height: 0.5rem;
    line-height: 0.5rem;
    text-align: center;
    box-shadow: inset 0px 1px 0px 0px rgba(249, 229, 196, 0.18);
  }
}
</style>
