<template>
  <div>
    <a-row>
      <a-col :xs="20" :sm="18" :md="12" :lg="7" :xl="5">
        <div class="head-logo">
          <a-icon
            class="head-trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            style="z-index:1051"
            @click="changeAsidebar()"
          ></a-icon>
          <a-avatar :size="25" src="../../../static/logo.png" />
          <span class="head-title">通用文件服务</span>
        </div>
      </a-col>
      <a-col
        :xs="{span: 4, offset:0}"
        :sm="{span: 6, offset:0}"
        :md="{span: 4, offset:8}"
        :lg="{span: 3, offset:14}"
        :xl="{span: 2, offset:17}"
      >
        <div class="head-info" @click="changeHeadMenu()">
          <a-avatar style="backgroundColor:#87d068" icon="user" />
          <div class="draw-down">
            <span style="font-size:1.1rem; margin:0 .5rem 0 .5rem;">{{userName}}</span>
            <a-icon type="down" />
          </div>
        </div>
        
        <a-modal
          title="修改密码"
          :visible="visible"
          @ok="changePwd"
          :confirmLoading="confirmLoading"
          @cancel="handleCancel"
          cancelText="取消"
          okText="修改"
          okType="danger"
          :destroyOnClose="true"
        >
        <a-row>
          <a-col :xs="{span: 24, offset:0}"
        :sm="{span: 24, offset:0}"
        :md="{span: 24, offset:0}"
        :lg="{span: 23, offset:1}"
        :xl="{span: 22, offset:2}">
        <a-form :form="form">
            <a-form-item label="当前密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <a-input
                v-decorator="['oldPsd', { rules: [{ required: true, message: '请输入原密码' }] }]"
                type="password"
                placeholder="输入原密码"
              />
            </a-form-item>
            <a-form-item label="新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <a-input
                v-decorator="['newPsd', { rules: [{ required: true, message: '请输入新密码' }] }]"
                type="password"
                placeholder="输入新密码"
              />
            </a-form-item>
            <a-form-item label="确认新密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              <a-input
                v-decorator="['newPsd2', { rules: [{ required: true, message: '请再次输入新密码' }] }]"
                type="password"
                placeholder="再次输入新密码"
              />
            </a-form-item>
          </a-form>
        </a-col>
        </a-row>
          
        </a-modal>
      </a-col>
    </a-row>
    <div class="mask" v-if="showHeadMenu" @click="changeHeadMenu()"></div>
        <transition name="bounce">
          <div class="head-menu" v-if="showHeadMenu" @click="changeHeadMenu()">
            <a-menu slot="overlay">
              <a-menu-item>
                <router-link to="/home">
                  <a-icon type="user" />
                  <span>首页</span>
                </router-link>
              </a-menu-item>
              <a-menu-item @click="showChangePwdModal">
                <a-icon type="edit" />
                <span>修改密码</span>
              </a-menu-item>
              <a-menu-item @click="logout">
                <a-icon type="poweroff" />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </div>
        </transition>
  </div>
</template>

<script>
import { Modal } from "ant-design-vue";
import * as api from "@/api/api";
export default {
  data() {
    return {
      showHeadMenu: false,
      visible: false,
      confirmLoading: false,
      oldPsd: "",
      newPsd: "",
      newPsd2: "",
      form: this.$form.createForm(this, { name: "PasswordUpdate" })
    };
  },
  computed: {
    userName: function() {
      return JSON.parse(sessionStorage.getItem("user")).name;
    },
    collapsed: function() {
      let screenSize = this.$store.getters.getScreenSize;
      if (screenSize <= 639) {
        return this.$store.getters.getSiderShow;
      } else {
        return this.$store.getters.getAsidebarCollapse;
      }
    }
  },
  methods: {
    changeAsidebar: function() {
      let screenSize = this.$store.getters.getScreenSize;
      let asidebarCollapse = this.$store.getters.getAsidebarCollapse;
      if (screenSize <= 639) {
        if (asidebarCollapse) {
          this.$store.commit("ASIDEBAR_COLLAPSE");
        }
        this.$store.commit("SIDER_SHOW");
      } else {
        this.$store.commit("ASIDEBAR_COLLAPSE");
      }
    },
    changeHeadMenu: function() {
      this.showHeadMenu = this.showHeadMenu ? false : true;
    },
    showChangePwdModal() {
      this.visible = true;
    },
    handleCancel(e) {
      this.visible = false;
    },
    changePwd() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.newPsd.length < 6) {
            this.$message.error("密码长度不得少于6位字符");
            return;
          }
          if (
            !/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]+$/.test(
              values.newPsd
            )
          ) {
            this.$message.error("密码只能使用数字，英文字母或符号");
            return;
          }
          if (values.newPsd != values.newPsd2) {
            this.$message.error("两次输入密码不相同");
            return;
          }
          let params = { oldPsd: values.oldPsd, newPsd: values.newPsd };
          api.changePassword(params)
            .then(response => {
              if (response) {
                if (response.code == 0) {
                  this.$message.success("密码修改成功，将重新登陆");
                  let that = this;
                  setTimeout(function() {
                    that.visible = false;
                    that.$router.push({ path: "/login" });
                  }, 2000);
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
      this.confirmLoading = false;
    },
    // changePwd() {
    //   Modal.info({
    //     title: "提示",
    //     content: "修改密码功能暂不开通"
    //   });
    // },
    logout: function(){
      api
        .logout()
        .then(response => {
          if (response.code == 0) {
            this.$message.success(response.message);
          } else {
            this.$message.error("系统异常，强制退出");
          }
          let that = this;
          setTimeout(() => {
            that.$router.push({ path: "/logout" }).catch(err=>{});
          }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
@import "../../assets/style/fade.css";
.head-trigger {
  font-size: 1.1rem;
  line-height: 3.6rem;
  padding: 0.3rem 0.8rem 0 1rem;
  cursor: pointer;
  transition: color 0.3s;
}
.head-trigger:hover {
  color: #000;
}

.head-logo {
  height: 3.6rem;
  text-align: center;
  display: flex;
  margin: 0 auto;
  align-items: center;
}
.head-title {
  font-size: 1.4rem;
  margin: 0 0.5rem;
  font-weight: 400;
}
.head-info {
  height: 3.6rem;
  font-size: 0.1rem;
  display: flex;
  float: right;
  align-items: center;
  padding-right: 1rem;
}
.head-info:hover {
  color: #000;
}
.head-menu {
  position: absolute;
  top: 4rem;
  right: 1.5rem;
  width: 8rem;
  height: 9rem;
  background-color: #fff;
  box-shadow: 0 0 3px #75797d;
  z-index: 100;
}
.ant-menu-item {
  text-align: left;
  margin-bottom: 0;
}
.ant-menu-item:hover {
  background-color: #eae3e3;
}
.bounce-enter-active {
  animation: flipInX 0.2s;
}
.bounce-leave-active {
  animation: flipInX 0.2s reverse;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}
.draw-down {
  display: flex;
  align-items: center;
}
.ant-modal-content {
  width: 100px;
}
@media only screen and (max-width: 639px) {
  .draw-down {
    display: none;
  }
}
</style>