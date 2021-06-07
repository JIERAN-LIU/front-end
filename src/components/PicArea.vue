<template>
  <div class="container">
    <p>
      <el-upload
        class="upload-demo"
        ref="upload"
        :file-list="[]"
        :on-success="() => this.$refs.upload.clearFiles()"
        action="/api/file/upload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </p>
    <el-row>
      <el-col v-for="i in list" :key="i.url" :span="8">
        <div class="img-wrapper">
          <el-popconfirm v-if="!isChoosing" title="Delete this picture?" confirm-button-text='OK'
            cancel-button-text='NO'>
            <div slot="reference" class="delete-wrapper">
              <i class="el-icon-delete-solid"></i>
            </div>
          </el-popconfirm>
          <div v-else class="radio-wrapper"><el-radio :label="i.url"><i></i></el-radio></div>
          <img :src="i.url" class="img" alt="" />
        </div>
      </el-col>
    </el-row>
    <p class="page-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="refreshTable"
        :total="total"
      >
      </el-pagination>
    </p>
  </div>
</template>

<script>
// import { getOrder } from "@api";
export default {
  name: "home",
  props: {
    isChoosing: Boolean
  },
  data() {
    return {
      tableData: [],
      total: 0,
      active:'',
      list: [
        {
          url: "https://dummyimage.com/500x200/000/fff",
        },
        {
          url: "https://dummyimage.com/350x200/000/fff",
        },
        {
          url: "https://dummyimage.com/789x560/000/fff",
        },
        {
          url: "https://dummyimage.com/600x400/000/fff",
        },
        {
          url: "https://dummyimage.com/350x800/000/fff",
        },
        {
          url: "https://dummyimage.com/900x200/000/fff",
        },
        {
          url: "https://dummyimage.com/500x280/000/fff",
        },
      ],
    };
  },
  watch: {},
  created() {
    this.refreshTable();
  },
  mounted() {},
  destroyed() {},
  methods: {
    refreshTable(pageNum = 1) {
      // getOrder({
      //   pageNum: pageNum - 1,
      //   pageSize: 10,
      // }).then((res) => {
      //   const { total, list } = res.data;
      //   this.total = total;
      //   this.tableData = list;
      // });
    }
  },
};
</script>


<style scoped>
.page-wrapper {
  text-align: right;
  margin: 10px;
}
.img-wrapper {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #eee;
  transition: transform 0.3s;
  position: relative;
}
.img-wrapper:hover {
  background: #eee;
  transform: translateY(-2px);
}
.delete-wrapper {
  display: none;
}
.radio-wrapper {
  position: absolute;
  top: 10px;
  left: 10px;
}
.img-wrapper:hover .delete-wrapper {
  display: block;
  position: absolute;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 50%;
  background: rgb(255 99 106 / 50%);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.img {
  max-width: 100%;
  max-height: 500px;
}
</style>
