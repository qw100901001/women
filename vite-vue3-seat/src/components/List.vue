<script setup>
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dataList: {
    type: Boolean,
    default: []
  },
  errorMsg: {
    type: String,
    default: ""
  }
});
const emit = defineEmits(["close"]);
const handleMaskClick = () => {
  emit("close");
};
const handleItemClick = (item) => {
  const { name, value } = item;
  if (name) {
    router.push({ path: "/resultPage", query: { name, value } });
  }
};
</script>
<template>
  <div class="list-modal-mask" v-if="visible" @click="handleMaskClick">
    <div class="list-modal">
      <div class="tip">查询到多位宾客，请选择：</div>
      <div class="list-content">
        <div class="list-wrap">
          <div
            class="list-item"
            v-for="item in dataList"
            :key="item.name"
            @click.stop="handleItemClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.list-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f9e5c4;
  font-size: 0.15rem;
  .list-modal {
    width: 2.6rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 6px;
    backdrop-filter: blur(8px);
    max-height: 80%;
    .tip {
      height: 0.65rem;
      padding: 0.22rem 0.18rem 0;
      box-sizing: border-box;
    }
    .list-content {
      max-height: calc(70vh - 0.65rem);
      overflow-y: auto;
      .list-item {
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        box-shadow: inset 0px 1px 0px 0px rgba(249, 229, 196, 0.18);
      }
    }
  }
}
</style>
