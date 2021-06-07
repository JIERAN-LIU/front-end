<template>
<div style="height: 100%">
  <div class="login-container">
    
  </div>
  <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">Welcome</h3>
      </div>

      <el-form-item prop="account">
        <el-input
          ref="account"
          v-model="loginForm.account"
          placeholder="Account"
          name="account"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
      </el-tooltip>
      <p class="fp" @click="startFp">Forget password</p>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >

    </el-form>
</div>
  
</template>

<script>
import { login, forgetPassword } from '../../api'
export default {
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "",
        password: "",
      },
      loginRules: {
        account: [{ required: true, trigger: "blur" }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      forgetRules: {
        account: [{ required: true, trigger: "blur" }]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      isFP: false
    };
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.account === "") {
      this.$refs.account.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  computed: {
    rules () {
      return this.isFP ? this.forgetRules : this.loginRules
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    handleLogin() {
      this.isFP = false;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const req = {
            username: this.loginForm.account,
            password: this.loginForm.password
          }
          login(req)
            .then((res) => {
              if (res.status === 'error') {
                this.loading = false;
                return
              }
              localStorage.setItem('user', JSON.stringify(res))
              localStorage.setItem('Authorization', `Basic ${btoa(this.loginForm.account + ':' + this.loginForm.password)}`)
              this.$router.push({
                path: "/"
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    startFp () {
      this.isFP = true;
      this.$refs.loginForm.clearValidate()
      this.$nextTick(() => {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$confirm('We will send a new password to ' + this.loginForm.account, 'Tip', {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              forgetPassword({ account: this.loginForm.account }).then(data => {
                if (!data.error) {
                  this.$message({
                    message: 'success!',
                    type: 'success',
                    duration: 1.5 * 1000
                  })
                }
              })
            })
          }
        })
      })
    }
  },
};
</script>


<style scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: hue-rotate(200deg);
}
.login-form {
  position: absolute;
  width: 300px;
  max-width: 100%;
  overflow: hidden;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 350px;
}
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
}
.tips span:first-of-type {
  margin-right: 16px;
}
.svg-container {
  padding: 6px 5px 6px 15px;
  color: #889aa4;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}
.title-container {
  position: relative;
  color: #333;
}
.title-container .title {
  font-size: 40px;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
.thirdparty-button {
  position: absolute;
  right: 0;
  bottom: 6px;
}
.fp {
  font-size: 12px;
  text-align: right;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
