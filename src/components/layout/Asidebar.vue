<template>
  <!-- <a-menu mode="inline" :inlineCollapsed="collapsedSide">
    <a-sub-menu v-for="firstMenu in menu" :key="firstMenu.icon">
      <span slot="title">
        <a-icon :type="firstMenu.icon" />
        <span>{{firstMenu.name}}</span>
      </span>
      <a-menu-item v-for="secondMenu in firstMenu.subAction" :key="secondMenu.id">
        <router-link :to="secondMenu.url">{{secondMenu.name}}</router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>-->
  <a-menu mode="inline" :inlineCollapsed="collapsedSide" >
    <a-menu-item key="1">
      <router-link to='/home/system-user'>
        <a-icon type="user" />
        <span>用户管理</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="2">
      <router-link to='/home/stock-base'>
        <a-icon type="hdd" />
      <span>资源管理</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
import * as api from "@/api/system";
export default {
  data() {
    return {
      menu: []
    };
  },
  computed: {
    collapsedSide: function() {
      return this.$store.getters.getAsidebarCollapse;
    }
  },
  methods: {
    getMenu() {
      let menu = JSON.parse(sessionStorage.getItem("menu"));
      if (menu) {
        this.menu = menu;
      } else {
        api
          .getMenu()
          .then(response => {
            if (response) {
              if (response.code == 0) {
                this.menu = response.content;
                sessionStorage.setItem("menu", JSON.stringify(this.menu));
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  mounted() {
    this.getMenu();
  }
};
</script>
<style>
.ant-menu {
  text-align: left;
}
.ant-menu-inline .ant-menu-submenu-title {
  font-size: 1rem;
}
.ant-menu-submenu-title .anticon {
  font-size: 1.2rem;
}
.ant-menu-inline-collapsed
  > .ant-menu-submenu
  > .ant-menu-submenu-title
  .anticon {
  font-size: 1.2rem;
}
</style>