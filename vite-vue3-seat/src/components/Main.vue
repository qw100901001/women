<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from "vue";
// 导入JSON数据文件
import tableList from "@/assets/table1013.json";
import Error from "@/components/Error.vue";
import List from "@/components/List.vue";

import { useRouter } from "vue-router";

const router = useRouter();

const imageList = [
  "https://xt-show.xitaoinfo.com/seatSelect/top.png",
  "https://xt-show.xitaoinfo.com/seatSelect/bottom_1218.png",
  "https://xt-show.xitaoinfo.com/seatSelect/bg_new.jpg"
];
const totalTasks = ref(imageList.length); // 总任务数：图片数+字体数（1个字体任务）
const completedTasks = ref(0); // 已完成任务数
const isLoading = ref(true); // 是否正在加载
const progressPercent = ref(0); // 进度百分比（0-100）
const progressText = ref("0%");
const clickedSearch = ref(false);
const searchKey = ref("");
const originalList = ref([]);
const isDropdownVisible = ref(true);
const searchInputRef = ref(null);
const errorPopupVisible = ref(false);
const listPopupVisible = ref(false);
let resizeTimer = null; // 防抖定时器
// 标记是否是键盘弹起状态
const isKeyboardShow = ref(false);
// 表单垂直偏移量（控制上下移动）
const pageY = ref(0);
// 记录初始窗口高度（用于判断键盘是否弹起）
let originalWindowHeight = 0;
// 窗口大小变化的监听函数（用于移除监听）
let resizeHandler = null;
// 输入框聚焦：键盘弹起时调整表单位置
const handleInputFocus = () => {
  // 延迟执行：等待键盘完全弹起（200-500ms，适配不同设备）
  if (searchKey.value && filteredList.value.length) {
    isDropdownVisible.value = true;
  }
  clearTimeout(resizeTimer);
  setTimeout(() => {
    const currentWindowHeight = window.innerHeight;
    if (currentWindowHeight < originalWindowHeight) {
      isKeyboardShow.value = true;
      pageY.value = -(originalWindowHeight - currentWindowHeight - 120) / 2;
    }
  }, 300);
};
// 存储当前选中的项（单选）
const selectedItem = ref(null);

const filteredList = computed(() => {
  if (!searchKey.value) {
    //关键词为空 返回空
    return [];
  }
  return originalList.value.filter((item) =>
    item.name.toLowerCase().includes(searchKey.value.toLowerCase())
  );
});
watch(progressPercent, (newVal) => {
  progressText.value = `${newVal}%`;
});

const updateProgress = () => {
  completedTasks.value++;
  // 计算进度百分比（取整，避免小数）
  progressPercent.value = Math.floor(
    (completedTasks.value / totalTasks.value) * 100
  );
  // 所有任务完成后，隐藏加载界面
  if (completedTasks.value >= totalTasks.value) {
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  }
};
const loadImage = (imgUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve();
    };
    img.onerror = () => {
      resolve();
    };
    img.src = imgUrl;
  }).then(() => {
    updateProgress();
  });
};
const preloadAll = async () => {
  //   const fontTask = loadFont();
  const imageTasks = imageList.map((imgUrl) => loadImage(imgUrl));
  await Promise.all([...imageTasks]);
};
const shouldShowDropdown = computed(() => {
  const hasKey = !!searchKey.value.trim();
  const hasMoreThanOneResult = filteredList.value.length >= 1;
  return hasKey && hasMoreThanOneResult;
});
// 监听窗口大小变化（应对屏幕旋转、键盘收起）
// const handleWindowResize = () => {
//   const currentWindowHeight = window.innerHeight;
//   if (currentWindowHeight >= originalWindowHeight) {
//     isKeyboardShow.value = false;
//     searchInputRef.value?.blur();
//     pageY.value = 0;
//     originalWindowHeight = currentWindowHeight;
//   }
// };
const handleWindowResize = () => {
  // 1. 防抖：避免resize事件频繁触发（延迟200ms执行，可调整）
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const currentWindowHeight = window.innerHeight;
    // 2. 增加判断：只有当键盘处于弹起状态时，才处理收起逻辑（避免初始状态误判）
    if (isKeyboardShow.value) {
      // 3. 延迟验证：再等100ms确认窗口高度是否真的恢复（避免键盘弹起中的临时回弹）
      setTimeout(() => {
        const finalWindowHeight = window.innerHeight;
        if (finalWindowHeight >= originalWindowHeight) {
          isKeyboardShow.value = false;
          // 4. 可选：增加判断，只有输入框处于focus状态时才blur（避免不必要的操作）
          if (document.activeElement === searchInputRef.value) {
            searchInputRef.value?.blur();
          }
          pageY.value = 0;
          originalWindowHeight = finalWindowHeight;
        }
      }, 100);
    }
  }, 200);
};
//初始化加载JSON数据
onMounted(() => {
  originalWindowHeight = window.innerHeight;
  originalList.value = tableList;
  preloadAll();
  resizeHandler = handleWindowResize;
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", resizeHandler);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeHandler);
});
const handleSearch = () => {
  console.log("filteredList", filteredList.value);
  if (filteredList.value.length > 1) {
    listPopupVisible.value = true;
    return;
  } else if (filteredList.value.length === 1) {
    selectedItem.value = filteredList.value[0];
  } else {
    errorPopupVisible.value = true;
    return;
  }
  const { name, value } = selectedItem.value;
  if (name) {
    router.push({ path: "/resultPage", query: { name, value } });
  }
};

// 处理结果项的点击选中（核心修改：将选中项名称赋值给searchKey）
const handleItemSelect = (item) => {
  if (selectedItem.value?.name === item.name) {
    selectedItem.value = null;
  } else {
    selectedItem.value = item;
    searchKey.value = item.name;
  }
  isDropdownVisible.value = false;
};
// 输入框失焦事件：隐藏下拉框
const handleBlur = () => {
  //   // 这里加一个微延迟，避免点击下拉项时先失焦隐藏，导致无法触发点击事件
  pageY.value = 0;
  setTimeout(() => {
    isKeyboardShow.value = false;
    originalWindowHeight = window.innerHeight;
  }, 300);
};
const handleCompositionEnd = () => {
  //   isDropdownVisible.value = false;
};
const handleClickOutside = (e) => {
  if (searchInputRef.value && !searchInputRef.value.contains(e.target)) {
    isDropdownVisible.value = false;
  }
};
const handleInput = () => {
  isDropdownVisible.value = true;
};
const handleRouter = () => {
  router.push({ name: "ImgPage" });
};
</script>

<template>
  <div class="loader" v-if="isLoading">
    <div class="loader-graph middle">
      <div class="loading-outline">
        <div id="loading-bar" :style="{ width: `${progressPercent}%` }"></div>
      </div>
      <div class="loader-progress">{{ progressText }}</div>
    </div>
  </div>

  <div class="main-container" v-show="!isLoading">
    <div class="top-bg" v-if="!isKeyboardShow">
      <img src="https://xt-show.xitaoinfo.com/seatSelect/top.png" alt="" />
    </div>
    <div
      class="content-wrapper"
      :style="{ transform: `translateY(${pageY}px)` }"
    >
      <div class="main-content">
        <div class="bride-groom" v-show="!isKeyboardShow">
          <div class="flex-column bl">
            <span class="zh">游海克</span>
            <span class="en">HAIKE YOU</span>
          </div>
          <div class="flex-column bm">
            <span class="concat">&</span>
          </div>
          <div class="flex-column br">
            <span class="zh"
              >梁<span style="visibility: hidden">X</span>艳</span
            >
            <span class="en">IRIS LEUNG</span>
          </div>
        </div>
        <div class="search-box" v-if="!(selectedItem && clickedSearch)">
          <div class="tip">输入名称查询您的座位</div>
          <div class="search-form">
            <div
              class="search-result"
              v-if="shouldShowDropdown && isDropdownVisible"
            >
              <div class="search-result-box">
                <div
                  class="guest-item"
                  v-for="item in filteredList"
                  :key="item.name"
                  @click.stop="handleItemSelect(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
            <div class="input-box">
              <input
                type="text"
                placeholder="您的全名/昵称"
                v-model="searchKey"
                @input="handleInput"
                @focus="handleInputFocus"
                @blur="handleBlur"
                ref="searchInputRef"
              />
            </div>
            <div class="input-box input-button" @click="handleSearch">
              确认查询
            </div>
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
  <Error
    :visible="errorPopupVisible"
    @close="errorPopupVisible = false"
  ></Error>
  <List
    :visible="listPopupVisible"
    @close="listPopupVisible = false"
    :dataList="filteredList"
  ></List>
</template>

<style scoped lang="less">
@import "../styles/main.less";
</style>
