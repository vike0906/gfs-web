<template>
  <div class="login-body">
    <a-row>
      <a-col
        :xs="{span: 20, offset:2}"
        :sm="{span: 16, offset:4}"
        :md="{span: 14, offset:5}"
        :lg="{span: 12, offset:6}"
        :xl="{span: 10, offset:7}"
      >
        <div class="login-content">
          <div style="display:inline">
            <a-avatar :size="25" src="../../../static/logo.png" style="vertical-align: middle;" />
            <span style="font-size:1.5rem;vertical-align: middle;">通用文件服务</span>
            <!-- <span style="font-size:1.5rem;vertical-align: middle;">The General File Server</span> -->
          </div>
          <h1 style="margin-top: 1.5rem;text-align: center;font-size: 2rem;">欢迎登陆</h1>
          <p style="margin-top: .5rem;font-size:1rem;color:#5e7d8a;">在下方输入登录名和密码</p>
          <a-row>
            <a-col
              :xs="{span: 22, offset:1}"
              :sm="{span: 16, offset:4}"
              :md="{span: 14, offset:5}"
              :lg="{span: 12, offset:6}"
              :xl="{span: 10, offset:7}"
            >
              <a-input
                class="login-name"
                v-model="loginName"
                @keyup.enter.native="login"
                placeholder="登陆名"
              />
              <a-input-password
                class="login-password"
                v-model="password"
                @keyup.enter.native="login"
                placeholder="密码"
              />
              <a-row v-show="captchaSwitch" class="login-captcha" type="flex" justify="space-between" align="middle">
                <a-col :span=10>
                  <a-input
                    class="captcha"
                    v-model="captcha"
                    @keyup.enter.native="login"
                    placeholder="图形验证码"
                  />
                </a-col>
                
                <a-col :span=14 style="text-align:left;">
                  <a @click="changeCaptcha"><img class="captchaImg" :src="captchaImg" alt="点击切换"> </a>
                </a-col>
              </a-row>

              <a-button type="primary" class="login-summit" :loading="loading" @click="login">登陆</a-button>
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import * as api from "@/api/api";
export default {
  data: function() {
    return {
      loading: false,
      loginName: "",
      password: "",
      
      captchaSwitch: false,
      captcha:"",
      serial: "",
      captchaImg: "",
    };
  },
  methods: {
    login: function() {
      const that = this;
      let name = this.loginName;
      let password = this.password;
      let captcha = this.captcha;
      let serial = this.serial;
      if (name.length == 0) {
        this.$message.error("请输入登陆名");
        return;
      }
      if (password.length == 0) {
        this.$message.error("请输入密码");
        return;
      }
      if (this.captchaSwitch && captcha.length == 0) {
        this.$message.error("请输入验证码");
        return;
      }
      this.loading = true;
      if(!this.captchaSwitch){
        //访问后台，获取登录信息
        let params = { name: name, password: password };
          api.login(params)
            .then(response => {
              this.loading = false;
              if (response) {
                sessionStorage.setItem("user", JSON.stringify(response.content));
                this.$router.push({ path: "/home" });
              }
            })
            .catch(err => {
              this.loading = false; 
            });
      }else{
        let validation = {serial:serial,captcha:captcha}
        api.validation(validation).then(response=>{
          if(response){
            //访问后台，获取登录信息
            let params = { name: name, password: password };
            api.login(params)
              .then(response => {
                this.loading = false;
                if (response) {
                  sessionStorage.setItem("user", JSON.stringify(response.content));
                  this.$router.push({ path: "/home" });
                }
              })
              .catch(err => {
                this.changeCaptcha();
                this.loading = false; 
              });
          }
        }).catch(err=>{
          this.changeCaptcha();
          this.loading = false;
        })
      }
      
    },
    changeCaptcha(){
      this.serial = this.uuid();
      this.captchaImg = this.$API_ROOT+'/captcha?serial='+this.serial;
    },
    // 获取uuid
    uuid() {
      let s = [];
      let hexDigits = "0123456789abcdef";
      for (let i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      let uuid = s.join("");
      this.text = uuid;
      return uuid;
    }
  },
  created(){
    if(this.captchaSwitch){
      this.serial = this.uuid();
      this.captchaImg = this.$API_ROOT+'/captcha?serial='+this.serial;
    }
  }
};
</script>
<style scoped>
.login-name {
  margin-top: 2rem;
}
.login-password {
  margin-top: 1rem;
  text-align: left;
}
.login-captcha {
  margin-top: 1rem;
  
  
}
.captchaImg{
  height: 2.2rem;
  width: 6.3rem;
  padding-left: .5rem
  
}
.captcha{
  padding-left: .5rem;
}
.login-summit {
  margin-top: 1rem;
  width: 100%;
}
.login-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f6;
  /* background-color: #e8e8f0; */
}
.login-content {
  margin-top: 10rem;
  height: 20rem;
  color: #324148;
  /* background-color: #fff; */
}

@media only screen and (max-width: 639px) {
  .login-content {
    margin-top: 3rem;
  }
}
</style>