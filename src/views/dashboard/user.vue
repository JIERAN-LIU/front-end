<template>
  <div class="container">
    <div class="left-wrapper">
      <BorrowList />
    </div>
    <div class="comment-wrapper">
      <CommentList />
    </div>
    <div>
      <div class="info">
        <div class="bg-gray"></div>
        <div class="avatar-wrapper">
          <el-upload
            class="upload-demo"
            v-if="isEdit"
            accept=".png, .jpg, .jpeg"
            :headers="{ Authorization: auth }"
            :on-success="avatarSuccess"
            :action="actionUrl">
            <div class="img" :style="{ 'background-image': 'url(' + editInfo.avatar +')' }"></div>
            <!-- <img :src="editInfo.avatar" alt=""> -->
            <!-- <el-button size="small" type="primary">click to upload</el-button> -->
          </el-upload>
          <div v-else class="img" :style="{ 'background-image': 'url(' + userInfo.avatar +')' }"></div>

          <!-- <img  :src="userInfo.avatar" alt=""> -->
        </div>
        <div v-loading="loading" class="user-info-wrapper">
          <h3 class="u-name">
            <span v-if="!isEdit">{{userInfo.username}}</span>
            <el-input style="width: 80%;" v-else v-model="editInfo.username"></el-input>
          </h3>
          <div v-if="!isEdit" class="info-row">
            <span class="info-name">email:</span>
            <span class="info-value">{{userInfo.email}}</span>
          </div>
          <div class="center input-emali" v-else>
            <el-input style="width: 80%;"  v-model="editInfo.email"></el-input>
          </div>
          <div v-if="!isEdit" class="info-row">
            <span class="info-name">admission at:</span>
            <span class="info-value">{{userInfo.admission_at}}</span>
          </div>
          <el-button type="primary" v-if="!isEdit" plain class="edit-btn" @click="edit">EDIT</el-button>
          <p class="btn-wrapper" v-else>
            <el-button @click="isEdit = false">CANCEL</el-button>
            <el-button type="primary"  @click="save">SAVE</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo, setUserInfo } from "@api";
import BorrowList from './components/BorrowList'
import CommentList from './components/CommentList'
export default {
  name: "home",
  components: {
    BorrowList,
    CommentList
  },
  data() {
    return {
      loading: false,
      userInfo: {},
      isEdit: false,
      editInfo: {},
      recommendList: [],
      auth: localStorage.getItem('Authorization'),
      actionUrl: process.env.NODE_ENV === 'production' ? '/upload/' : '/api/upload/'
    };
  },
  created () {
    this.getInfo()
  },
  methods: {
    edit () {
      this.isEdit = true
      this.editInfo = {
        ...this.userInfo
      }
    },
    save () {
      this.isEdit = false
      this.loading = true
      const { username, id, email, avatar } = this.editInfo
      const originName = this.userInfo.username
      setUserInfo({ username, id, email, avatar }).then(() => {
        const auth = localStorage.getItem('Authorization')
        const originInfo = atob(auth.replace('Basic ', ''))
        const splitInfo = originInfo.replace(originName, '')
        const newAuth = btoa(username + splitInfo)
        localStorage.setItem('Authorization', newAuth)
        this.auth = newAuth
        this.getInfo()
      }).finally(() => {
        this.loading = false
      })
    },
    getInfo () {
      const info = JSON.parse(localStorage.getItem('user'))
      this.loading = true
      getUserInfo(info.id).then(res=> {
        this.userInfo = res
      }).finally(() => {
        this.loading = false
      })
    },
    avatarSuccess (res) {
      this.editInfo.avatar = res.url
    }
  }
};
</script>


<style scoped>
.container {
  display: flex;
  padding: 20px;
  max-width: 1300px;
  margin: 0 auto;
}
.info {
  width: 270px;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 5px;
  position: relative;
  padding-bottom: 10px;
}
.left-wrapper {
  width: 370px;
}
.bg-gray {
  height: 104px;
  background-color: #e8e8e8;
}
.avatar-wrapper {
  /* margin: 0 auto; */
}
.comment-wrapper {
  flex: 1;
  padding: 0 25px;
  margin: 0 35px;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  place-self: baseline;
}
.avatar-wrapper .img {
  border: 4px solid #fff;
  width: 160px;
  aspect-ratio: auto 160 / 160;
  height: 160px;
  display: block;
  margin: 0 auto;
  top: 25px;
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 50%;
  background: #eee;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.user-info-wrapper {
  margin-top: 100px;
}
.u-name {
  font-weight: 500;
  text-align: center;
}
.info-row {
  padding: 5px;
  color: #666;
}
.edit-btn {
  width: 80%;
  margin: 0 10%;
}
.center {
  text-align: center;
}
.input-emali {
  margin: 13px 0;
}
.btn-wrapper {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}
</style>
<style>
.avatar-wrapper .el-upload-list {
  display: none;
}
</style>
