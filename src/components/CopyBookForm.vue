<template>
  <el-form
    ref="form"
    :model="form"
    :rules="formRules"
    style="width: 100%"
  >
    <el-form-item
      prop="copies"
    >
      <span slot="label">
        <span>copies</span>
        <CopyModal @newCopy="newCopy">
          <el-button slot-scope="{changeDisplay}" class="plus-btn" @click="changeDisplay"><i class="el-icon-plus"></i> New Copy</el-button>
        </CopyModal>
      </span>
      <el-table style="width: 100%" :data="form.copies">
        <el-table-column
          prop="status"
          label="status"
          width="105">
        </el-table-column>
        <el-table-column
          prop="location"
          label="location">
        </el-table-column>
        <el-table-column
          prop="section"
          label="section">
        </el-table-column>
        <el-table-column
          prop="media_type"
          label="media type"
          width="155">
        </el-table-column>
        <el-table-column
          label="Handle"
          width="70">
          <template slot-scope="scope">
            <el-button @click="delCopy(scope.row)" type="danger">Del</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>


<script>
import CopyModal from './CopyModal'
export default {
  components: {
    CopyModal
  },
  data() {
    return {
      form: {
        copies: []
      },
      formRules: {
        copies: [
          { required: true, message: 'copy is required' }
        ]
      }
    };
  },
  props: {
    
  },
  computed: {
    
  },
  watch: {

  },

  methods: {
    newCopy (copy) {
      this.form.copies.push(copy)
    },
    async getCopy () {
      await this.$refs.form.validate()
      return this.form.copies
    },
    delCopy (row) {
      this.form.copies = this.form.copies.filter(i => i !== row)
    }
  },
};
</script>
<style scoped>
.plus-btn {
  position: relative;
  z-index: 100;
  margin-left: 20px;
}
</style>