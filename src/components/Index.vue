<template>
  <div class="template">
    <div class="content">
      <h1 class="welcome">欢迎访问通用文件服务管理端</h1>
    </div>
  </div>
</template>
<script>

export default {
  data:function(){
    return {
      statistics:[]
    };
  },
  created(){
    //do nothing...
  },
  mounted() {
    this.getStatistics();
  },
  methods:{
    getStatistics(){
      // api.getStatistics().then(response=>{
      //   if(response){
      //     this.statistics = response.content;
      //     this.drawLine();
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // });
    }
  }
};
</script>
<style scoped>
.content {
  background-color: #f5f5f6;
  /* background-color: #fff; */
  min-width: 100%;
  min-height: 100%;
  padding: 10px;
}
.welcome {
  margin-top: 5rem;
  font-size: 2em;
  text-align: center;
}


</style>