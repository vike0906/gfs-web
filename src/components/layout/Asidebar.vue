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
      <router-link to='/home/user'>
        <a-icon type="team" />
        <span>用户管理</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="2">
      <router-link to='/home/resource'>
        <a-icon type="hdd" />
      <span>资源管理</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
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