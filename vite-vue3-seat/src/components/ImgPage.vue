<script setup>
import ImgZoom from './ImgZoom.vue';
// import "vue-touch-zoom/dist/style.css"; // 引入样式
</script>
<template>
  <div class="img-content">
    <ImgZoom
      src="https://xt-show.xitaoinfo.com/seatSelect/seatMap1219.jpg"
      :minScale="0.8"
      :maxScale="2"
      containerHeight="500px"
      style="margin-top: 20px;"
    />
  </div>
</template>

<style lang="less" scoped>
.img-content {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
  }
}
</style>
