<template>
  <el-form
    ref="form"
    :model="form"
    :rules="formRules"
    style="width: 100%"
    v-loading="loading"
  >
    <el-form-item
      prop="copies"
    >
      <span slot="label">
        <span>copies</span>
        <CopyModal ref="copyModal" @newCopy="newCopy">
          <el-button class="plus-btn" @click="() => $refs.copyModal.showModalAction()"><i class="el-icon-plus"></i> New Copy</el-button>
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
          width="150">
        </el-table-column>
        <el-table-column
          label="Handle"
          width="140">
          <template slot-scope="scope">
            <el-button @click="delCopy(scope.row)" size="mini" type="danger">Del</el-button>
            <el-button @click="() => $refs.copyModal.showModalAction(scope.row)" size="mini" type="primary">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>


<script>
import CopyModal from './CopyModal'
import { delCopy } from '@api'
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
      },
      loading: false
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
    setCopy (copies) {
      this.form.copies = copies
    },
    delCopy (row) {
      if (row.id) {
        this.loading = true
        delCopy(row.id).then(() => {
          this.form.copies = this.form.copies.filter(i => i !== row)
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.form.copies = this.form.copies.filter(i => i !== row)
      }
      
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