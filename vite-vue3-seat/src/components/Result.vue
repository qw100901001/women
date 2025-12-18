<script setup>
import { ref, onMounted, computed } from "vue";
// 导入JSON数据文件
import tableList from "@/assets/table.json";

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const clickedSearch = ref(false);
const searchKey = ref("");
const originalList = ref([]);
// 存储当前选中的项（单选）
const selectedItem = ref(null);

selectedItem.value = {
  name: route.query.name,
  value: route.query.value
};

const filteredList = computed(() => {
  if (!searchKey.value) {
    //关键词为空 返回空
    return [];
  }
  return originalList.value.filter((item) =>
    item.name.toLowerCase().includes(searchKey.value.toLowerCase())
  );
});
const shouldShowDropdown = computed(() => {
  const hasKey = !!searchKey.value.trim();
  const hasMoreThanOneResult = filteredList.value.length >= 1;
  const noSelectedItem = !selectedItem.value;
  let isNotMatch = true;
  if (
    filteredList.value.length === 1 &&
    filteredList.value[0].name === searchKey.value
  ) {
    isNotMatch = false;
    selectedItem.value = filteredList.value[0];
  }
  return hasKey && hasMoreThanOneResult && noSelectedItem && isNotMatch;
});
//初始化加载JSON数据
onMounted(() => {
  originalList.value = tableList;
});
const handleSearch = () => {
  clickedSearch.value = true;
};

// 处理结果项的点击选中（核心修改：将选中项名称赋值给searchKey）
const handleItemSelect = (item) => {
  if (selectedItem.value?.name === item.name) {
    selectedItem.value = null;
  } else {
    selectedItem.value = item;
    searchKey.value = item.name;
  }
};
const handleRouter = () => {
  router.push({ name: "ImgPage" });
};
</script>

<template>
  <div class="main-container">
    <div class="content-wrapper">
      <div class="top-bg">
        <img src="https://xt-show.xitaoinfo.com/seatSelect/top.png" alt="" />
      </div>
      <div class="main-content">
        <div class="bride-groom">
          <div class="flex-column bl">
            <span class="zh">游海克</span>
            <span class="en">HAIKE YOU</span>
          </div>
          <div class="flex-column bm">
            <span class="concat">&</span>
          </div>
          <div class="flex-column br">
            <span class="zh">梁&nbsp;艳</span>
            <span class="en">IRIS LEUNG</span>
          </div>
        </div>
        <div class="result-box">
          <div class="welcome">感谢您的到来</div>
          <div class="postion-content">
            <div class="row name">
              <span>您的姓名：</span>
              <span>{{ selectedItem.name }}</span>
            </div>
            <div class="row table">
              <span>您的桌号：</span>
              <span
                >第<span class="count">{{ selectedItem.value }} </span
                >桌</span
              >
            </div>
          </div>
          <div class="pos-map" @click="handleRouter">
            <span>查看座位分布图</span>
          </div>
        </div>
      </div>
      <div class="img-bottom-wrap">
        <div class="bottom-bg">
          <img
            src="https://xt-show.xitaoinfo.com/seatSelect/bottom_1218.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../styles/main.less";
</style>
