<template>
  <div class="a-container">
    <div @click="$router.push('/dashboard/book-detail/' + book.id)" class="a-avatar-wrapper">
      <img class="a-avatar" :src="book.cover" alt="">
    </div>

    <div class="rest-info">
      <h2>
        <router-link v-if="mode !== 'detail'" :to="'/dashboard/book-detail/' + book.id"><span v-html="book.title"></span></router-link>
        <span v-else v-html="book.title"></span>
      </h2>
      <p>
        <span class="a-tit">authors:</span>
        <span class="a-info">
          <router-link class="link-item" :to="'/dashboard/author-detail/' + i.id" v-for="i in book.authors_info" :disabled="i.id === Number(author)" :key="i.id">
            <span class="avatar-wrapper" :style="{ 'background-image': 'url(' + i.avatar + ')' }" v-if="mode === 'detail'">

            </span>
            <span>{{i.name}}</span>
          </router-link>
        </span>
      </p>
      <div class="flex-p">
        <p>
          <span class="a-tit">price:</span>
          <span class="a-info">{{book.price}}</span>
        </p>
        <p v-if="book.publisher_info">
          <span class="a-tit">publisher:</span>
          <span class="a-info">
            <span v-html="book.publisher_name || book.publisher_info.name"></span>
          </span>
        </p>
      </div>
      <div class="flex-p">
        <p>
          <span class="a-tit">ISBN 10:</span>
          <span class="a-info">
            <span v-html="book.isbn_10"></span>
          </span>
        </p>
        <p>
          <span class="a-tit">ISBN 13:</span>
          <span class="a-info">
            <span v-html="book.isbn_13"></span>
          </span>
        </p>
      </div>
      
      <div class="flex-p">
        <p>
          <span class="a-tit">Subject:</span>
          <span class="a-info">
            <span v-html="book.subject"></span>
          </span>
        </p>
        
        <p>
          <span class="a-tit">language:</span>
          <span class="a-info">
            <span v-html="book.language"></span>
          </span>
        </p>
      </div>
      <div class="flex-p">
        <p>
          <span class="a-tit">publication date:</span>
          <span v-if="book.publication_date" class="a-info">
            <span v-html="book.publication_date.slice(0, 10)"></span>
          </span>
        </p>
        <p>
          <span class="a-tit">Binding:</span>
          <span class="a-info">
            <span v-html="book.binding"></span>
          </span>
        </p>
      </div>
      <div class="flex-p">
        <p>
          <span class="a-tit">call number:</span>
          <span class="a-info">
            <span v-html="book.call_number"></span>
          </span>
        </p>
        <p>
          
        </p>
      </div>
      <p class="dec-p" v-if="mode !== 'detail'">
        <span class="a-tit">description:</span>
        <span class="a-info desc">
          <span v-html="book.description"></span>
        </span>
      </p>
      <p class="dec-p" v-if="mode !== 'detail'">
        <span class="a-tit">Toc:</span>
        <span class="a-info desc">
          <span v-html="book.toc"></span>
        </span>
      </p>
      
      <!-- <p>
        <span class="a-tit">Toc:</span>
        <span class="a-info desc">
          <span v-html="book.toc"></span>
        </span>
        <span></span>
      </p> -->

      <div v-if="mode !== 'detail' && !isReader" class="handler-wrapper">
        <el-tooltip v-if="!workbench" class="item" effect="dark" content="EDIT" placement="top">
          <span @click="$emit('onEdit')" class="handle-inner-wrapper">
            <i class="el-icon-edit"></i>
          </span>
        </el-tooltip>
        <el-tooltip v-if="!workbench" class="item" effect="dark" content="DELETE" placement="top">
          <el-popconfirm class="handle-inner-wrapper del" title="confirm to delete?" confirm-button-text='OK' cancel-button-text='NO' @confirm="$emit('onDelete')">
            <span slot="reference" class="del">
              <i class="el-icon-delete"></i>
            </span>
          </el-popconfirm>
        </el-tooltip>
        <el-tooltip v-if="workbench" class="item" effect="dark" content="BORROW" placement="top">
          <span @click="$emit('onBorrow')" class="handle-inner-wrapper borrow">
            <svg t="1622127686984" class="icon font-ico" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9077" width="512" height="512">
              <path d="M192 192h512v-64H128v768h576v-64H192z" p-id="9078" data-spm-anchor-id="a313x.7781069.0.i2" class="selected" fill="#ffffff"></path>
              <path d="M738 265l-49.3 49.2L850.5 476H320v72h530.5L688.7 709.8 738 759l247-247z" p-id="9079" data-spm-anchor-id="a313x.7781069.0.i1" class="selected" fill="#ffffff"></path>
            </svg>
          </span>
        </el-tooltip>
      </div>
    </div>
    <div style="width: 100%;" v-if="mode === 'detail'">
      <p>
        <span class="a-tit">description:</span>
        <span class="a-info">{{book.description}}</span>
      </p>
      <p>
        <span class="a-tit">toC:</span>
        <span class="a-info">{{book.toc}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: "home",
  props: {
    book: Object,
    mode: String,
    author: Number | String,
    workbench: Boolean
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['isReader']),
  },
  watch: {},
  created () {
    this.refreshTable()
  },
  mounted () { },
  destroyed () { },
  methods: {
    refreshTable (pageNum = 1) {

    },
    showDetail () {
      this.$emit('showDetail')
    }
  }
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
  line-height: 19px;
}
.a-avatar-wrapper {
  height: 200px;
  width: 140px;
  background: #ccc;
  text-align: center;
  line-height: 150px;
  font-size: 0;
}
.a-avatar {
  max-height: 200px;
  max-width: 140px;
  vertical-align: middle;
}
.a-tit {
  font-weight: 600;
  font-size: 14px;
  text-transform: capitalize;
  color: #555;
  display: inline-block;
  margin-top: 2px;
}
.a-info {
  color: #666;
  font-size: 13px;
  margin-left: 10px;
}
.a-more {
  color: #409eff;
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
  transition: all 0.3s;
}
.handle-inner-wrapper {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  display: inline-block;
  background: #fff;
  border-radius: 50%;
  margin-left: 20px;
  cursor: pointer;
  font-size: 15px;
}
.handle-inner-wrapper:hover {
  transform: translateY(-3px);
  transition: all 0.25s;
}
.handle-inner-wrapper.del {
  background: #fc9797;
  color: #fff;
}
.handle-inner-wrapper.borrow {
  background: #2196f3;
}
.link-item + .link-item {
  margin-left: 20px;
}
.avatar-wrapper {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  background-repeat: no-repeat;
  background-size: contain;
}
.font-ico {
  width: 20px;
  height: 20px;
  vertical-align: middle;
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
.flex-p {
  display: flex;
}
.flex-p > p {
  width: 50%;
}
.flex-p > p + p {
  padding-left: 5px;
}
</style>
