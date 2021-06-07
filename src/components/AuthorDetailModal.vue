<template>
  <el-dialog
      :title="author && author.name"
      destroy-on-close
      :visible="showInfo"
      @close="$emit('update:showInfo', false)"
    >
      <AuthorItem :author="author" mode="detail"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:showInfo', false)">CLOSE</el-button>
      </span>
    </el-dialog>
</template>

<script>
import AuthorItem from "./AuthorItem";
export default {
  props: {
    author: Object,
    showInfo: Boolean
  },
  components: {
    AuthorItem
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
}
.rest-info {
  flex: 1;
  margin-left: 10px;
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
  font-size: 16px;
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
</style>
