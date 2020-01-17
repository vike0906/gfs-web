<template>
  <a-layout id="home">
    <a-layout-header>
      <Header />
    </a-layout-header>
    <a-layout id="home-body">
      <a-layout-sider
        :trigger="null"
        collapsible
        v-model="collapsed"
        v-if="siderShow"
        class="ant-layout-sider-light"
      >
        <Asidebar />
      </a-layout-sider>
      <a-layout-content>
        <div class="content-mask" v-if="contentMaskShow" @click="maskClose()"></div>
        <a-layout style="height: 100%;">
          <a-layout-content class="wrapper"><router-view/></a-layout-content>
          <a-layout-footer id="fix-footer">
            <p style="text-align: center">
              Create By
              <a href="#" class="text-dark">SXZQ</a> © 2020
            </p>
          </a-layout-footer>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import Header from "./layout/Header";
import Asidebar from "./layout/Asidebar";
// import Main from "./Main";

export default {
  components: {
    Header,
    Asidebar
    // ,Asidebar,Main
  },
  // data() {
  //   return {
  //     screenWidth: document.body.clientWidth
  //   };
  // },
  computed: {
    collapsed: function() {
      return this.$store.getters.getAsidebarCollapse;
    },
    siderShow: function(){
      return this.$store.getters.getSiderShow;
    },
    contentMaskShow:function(){
      let screenSize = this.$store.getters.getScreenSize;
      if(screenSize <= 639){
        return this.$store.getters.getSiderShow;
      }else{
        return false;
      }
    }
  },
  methods:{
    init:function(){
      let screenWidth = document.body.clientWidth;
      let siderShowFlag = this.siderShow;
      if(screenWidth<=639){
        if(siderShowFlag){this.$store.commit("SIDER_SHOW");}
      }else{
        if(!siderShowFlag){this.$store.commit("SIDER_SHOW");}
      }
      this.$store.commit("SCREEN_SIZE",screenWidth);
    },
    maskClose:function(){
      this.$store.commit("SIDER_SHOW");
    },
    welcome() {
        this.$notification.open({
          message: '欢迎登陆',
          description:
            '本系统使用前后端分离设计，服务部署于Nginx代理服务器',
          icon: <a-icon type="smile" style="color: #108ee9" />,
        });
      },
  },
  created(){
    this.init();
    
    // this.welcome();
  },
  mounted() {
    let timer = false;
    const that = this;
    window.onresize = () => {
        let screenWidth = document.body.clientWidth;
        if (!timer) {
        timer = true;
        setTimeout(function() {
          let siderShowFlag = that.siderShow;
          if(screenWidth<=639){
            if(siderShowFlag){
              that.$store.commit("SIDER_SHOW");
            }
          }else{
            if(!siderShowFlag){
            that.$store.commit("SIDER_SHOW");
            }
          }
          that.$store.commit("SCREEN_SIZE",screenWidth);
          timer = false;
        }, 300);

      }
    };
  },
};
</script>

<style>
#home .ant-layout-header {
  height: 3.6rem;
  background-color: #fff;
  padding: 0 1px;
  box-shadow: 0 0 5px #75797d;
  z-index: 100;
}

#home .ant-layout-sider{
  z-index: 99;
}

#home-body {
  position: absolute;
  top: 3.6rem;
  bottom: 0;
  right: 0;
  left: 0;
  
}
#fix-footer{
  position:fixed;
  bottom:0px;
  left: 200px;
  right: 0px;
  z-index:2;
}
#home .ant-layout-content {
  background-color: #f5f5f6;
  color: #333;
  text-align: center;
}

#home .ant-layout-footer {
  background-color: #f5f5f6;
  color: #333;
  text-align: center;
  height: 2rem;
  padding: 0.3rem 0.5rem;
}
#home .wrapper {
  position:fixed;
  bottom:2rem;
  top: 3.6rem;
  left: 200px;
  right: 0px;
  padding: 10px 20px;
  overflow-x: hidden;
  overflow-y: scroll;
}
@media only screen and (max-width:639px){
  #home .ant-layout-sider{
    position: absolute;
    top: 0;
    left: 0;
    
    bottom: 0;
  }
}
.content-mask {
  position: fixed;
  top: 3.6rem;
  left: 200px;
  width: 100%;
  height: 100%;
  z-index: 98;
  /* background-color: #f5f5f5; */
  background-color: #aaa;
  opacity:0.5;
}
</style>