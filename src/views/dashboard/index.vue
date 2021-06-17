<template>
  <div class="container">
    <div class="header">
      <span class="title" @click="$route.name !== 'home' && $router.push('/dashboard/home')">LIBRARY SYSTEM</span>
      <el-dropdown>
        <span class="user"><i class="el-icon-user"></i><span class="name">{{getUserInfo.username}}</span></span> 
        <el-dropdown-menu style="min-width: 100px;margin: 0" slot="dropdown">
          <el-dropdown-item v-if="isReader" @click.native="$route.name !== 'user' && $router.push('/dashboard/user')"
            >User Center</el-dropdown-item
          >
          <el-dropdown-item @click.native="modifyPassword"
            >Modify Password</el-dropdown-item
          >
          <el-dropdown-item @click.native="logout">Log Out</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="body">
      <div class="tac">
        <div v-if="isAdmin || isLibrarian" class="menu">
          <el-menu @select="changeMenu" :default-active="activePath">
            <el-menu-item v-if="isLibrarian" index="workbench">
              <template slot="title"
                ><i class="el-icon-set-up"></i>WorkBench</template
              >
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title"
                ><i class="el-icon-menu"></i>Menu</template
              >
              <el-menu-item v-if="isLibrarian" index="book"><i class="el-icon-collection"></i> Book </el-menu-item>
              <el-menu-item v-if="isLibrarian" index="author"><i class="el-icon-user"></i> Author </el-menu-item>
              <el-menu-item v-if="isLibrarian" index="publisher"><i class="el-icon-office-building"></i> Publisher </el-menu-item>
              <el-menu-item v-if="isAdmin || isLibrarian" index="users"><i class="el-icon-user"></i> Users </el-menu-item>
              <el-menu-item v-if="isAdmin" index="college"><i class="el-icon-school"></i> College </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div class="view">
          <router-view :socket="socket" ref="view"></router-view>
        </div>
      </div>
    </div>

    <el-dialog title="Modify Password" :visible.sync="showModal" width="400px">
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item prop="oldPwd" label="Old Password">
          <el-input show-password v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="New Password">
          <el-input show-password v-model="form.newPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">Cancel</el-button>
        <el-button type="primary" @click="testForm">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { logout, modifyPassword } from "@api"
import { READER } from '../../constant'
import { mapGetters } from 'vuex'
export default {
  name: "Login",
  data() {
    return {
      activePath: "",
      console: window.console,
      msgNum: 0,
      socket: null,
      showModal: false,
      form: {
        oldPwd: "",
        newPwd: "",
      },
      rules: {
        oldPwd: [
          {
            required: true,
            message: "old password is required",
            trigger: "blur",
          },
        ],
        newPwd: [
          {
            required: true,
            message: "new password is required",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['isAdmin', 'getUserInfo', 'isReader', 'isLibrarian']),
  },
  watch: {
    $route: {
      handler: function (route) {
        this.activePath = route.name;
        if (this.activePath === "contact") {
          this.msgNum = 0;
        }
      },
      immediate: true,
    },
  },
  created() {
  },
  mounted() {
    console.log(this.getUserInfo)
  },
  destroyed() {},
  methods: {
    changeMenu(val) {
      if (this.$route.name !== val) {
        this.$router.push({name: val});
      }
    },
    logout() {
      logout().then(() => {
        localStorage.removeItem("user");
        return this.$router.push("/login");
      });
    },
    modifyPassword() {
      this.showModal = true;
    },
    testForm() {
      this.$refs.form.validate((flag) => {
        if (flag) {
          const data = this.form;
          this.showModal = false;
          modifyPassword({
            password: data.oldPwd,
            new_password: data.newPwd
          }).then((data) => {
            if (!data.error) {
              localStorage.setItem('Authorization', `Basic ${btoa(this.getUserInfo.username + ':' + this.form.newPwd)}`)
              this.form = {
                oldPwd: "",
                newPwd: "",
              };
              this.$message({
                message: "success!",
                type: "success",
                duration: 1.5 * 1000,
              });

            }
          });
        }
      });
    },
  },
};
</script>


<style scoped>
.container,
.body,
.tac {
  /* height: 100%; */
}
.header {
  position: fixed;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-content: center;
  justify-content: space-between;
  background: #e8e8e8;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  left: 0;
  z-index: 100;
}
.body {
  padding-top: 50px;
  box-sizing: border-box;
}
.user {
  font-size: 20px;
  cursor: pointer;
}
.tac {
  display: flex;
}
.tac > div {
  /* overflow: auto; */
}
.menu {
  width: 200px;
}
.view {
  width: calc(100% - 200px);
  margin: 0 auto;
}
.el-menu {
  height: 100%;
}
.el-menu-item {
  border-right: solid 1px #e6e6e6;
}
.msg {
  background: #f74e4e;
  color: #fff;
  min-width: 18px;
  text-align: center;
  top: -10px;
  position: relative;
  display: inline-block;
  height: 18px;
  font-size: 12px;
  line-height: 12px;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 9px;
}
.title {
  cursor: pointer;
}
.name {
  font-size: 13px;
  margin-left: 10px;
}
</style>
