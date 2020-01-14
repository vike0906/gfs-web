<template>
  <div class="template">
    <a-row>
      <a-col :span="24" style="text-align: left;padding: .5rem;">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>股票市场</a-breadcrumb-item>
          <a-breadcrumb-item>龙虎榜</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <div class="content">
      <a-row>
        <a-col :span="24">
          <h1 class="welcome">统计汇总A股龙虎榜</h1>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.content {
  background-color: #fff;
  width: 100%;
  height: 100%;
}
.welcome {
    margin-top: 3rem;
  text-align: center;
  font-size: 2rem;
}
.template{
    width: 100%;
    height: 100%;
}
</style>