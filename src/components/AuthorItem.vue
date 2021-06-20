<template>
  <div class="a-container">
    <div @click="$router.push('/dashboard/author-detail/' + author.id)" class="a-avatar-wrapper">
      <img class="a-avatar" :src="author.avatar" alt="">
    </div>
    
    <div class="rest-info">
      <h2>
        <span v-if="mode === 'detail'">{{author.name}}</span>
        <router-link v-else  :to="'./author-detail/' + author.id" >{{author.name}}</router-link>
      </h2>
      <p>
        <span class="a-tit">nation:</span>
        <span class="a-info">{{author.nation}}</span>
      </p>
      <p>
        <span class="a-tit">birthday:</span>
        <span class="a-info">{{author.birthday}}</span>
      </p>
      <p>
        <span class="a-tit">gender:</span>
        <span class="a-info">{{author.gender}}</span>
      </p>
      <!-- <p v-if="mode!=='detail'">
        <span class="a-tit">profile:</span>
        <span class="a-info">{{author.profile.length > 80 ? author.profile.slice(0,80) + '...' : author.profile}}</span>
        <span class="a-info a-more" @click="showDetail" v-if="author.profile.length > 80">MORE >></span>
      </p> -->
      <p class="dec-p" v-if="mode !== 'detail'">
        <span class="a-tit">profile:</span>
        <span class="a-info desc">{{author.profile}}</span>
      </p>
      <div v-if="mode!=='detail'" class="handler-wrapper">
        <span @click="$emit('onEdit')" class="handle-inner-wrapper">
          <i class="el-icon-edit"></i>
        </span>
        <el-popconfirm
            title="confirm to delete?"
            confirm-button-text='OK'
            cancel-button-text='NO'
            style="margin-left: 10px"
            @confirm="$emit('onDelete')"
          >
            <span slot="reference" class="handle-inner-wrapper del">
              <i class="el-icon-delete"></i>
            </span>
          </el-popconfirm>
      </div>
    </div>
    <div class="detail-profile" v-if="mode==='detail'">
      <p>
        <span class="a-tit">profile:</span>
        <span class="a-info">{{author.profile}}</span>
      </p>
    </div>
  </div>
</template>

<script>
// import { getOrder } from "@api";
export default {
  name: "home",
  props: {
    author: Object,
    mode: String
  },
  data() {
    return {

    }
  },
  watch: {},
  created() {
    this.refreshTable()
  },
  mounted() {},
  destroyed() {},
  methods: {
    refreshTable(pageNum = 1) {

    },
    showDetail () {
      this.$emit('showDetail')
    }
  },
};
</script>


<style scoped>
.a-container {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
.a-container:hover {
  background: #f9f9f9;
}
.rest-info {
  flex: 1;
  margin-left: 10px;
  position: relative;
  font-size: 12px;
}
.a-avatar-wrapper {
  height: 150px;
  width: 150px;
  background: #ccc;
  text-align: center;
  line-height: 150px;
  font-size: 0;
}
.a-avatar {
  max-height: 150px;
  max-width: 150px;
  vertical-align: middle;
}
.a-tit {
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
  color: #555;
}
.a-info {
  color: #666;
  font-size: 13px;
  margin-left: 10px;
}
.a-more {
  color: #409EFF;
  cursor: pointer;
}
.detail-profile {
  margin-top: 10px;
}
.handler-wrapper {
  position: absolute;
  opacity: 0;
  top: 10px;
  right: 10px;
}
.a-container:hover .handler-wrapper {
  opacity: 1;
  /* transform: translateY(-5px); */
  transition: all .3s;
}
.handle-inner-wrapper {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  display: inline-block;
  background: #eee;
  border-radius: 50%;
  margin-left: 20px;
  cursor: pointer;
  font-size: 15px;
}
.handle-inner-wrapper:hover {
  transform: translateY(-3px);
  transition: all .25s;
}
.handle-inner-wrapper.del {
  background: #fc9797;
  color: #fff;
}
.dec-p {
  display: flex;
  align-items: baseline;
}
.desc {
  flex: 1;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
