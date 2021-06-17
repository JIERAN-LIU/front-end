<template>
  <el-dialog
    title="Borrow"
    destroy-on-close
    append-to-body
    width="60%"
    @closed="successCbs = []"
    :visible.sync="showModal"
  >
    <el-table style="width: 100%" :data="this.copies" v-loading="loading">
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
        width="80">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.status !== 'Available'" @click="borrowBook(scope.row)" type="primary">Borrow</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showModal = false">Cancel</el-button>
    </span>
  </el-dialog>
</template>


<script>
import { getBookDetail, getCopyPage, borrowBook } from '@api'
export default {
  data() {
    return {
      showModal: false,
      id: null,
      copies: [],
      successCbs: [],
      loading: false
    };
  },
  props: {
    currentBorrower: Object
  },
  computed: {
    
  },
  watch: {

  },

  methods: {
    show (id, cbs = []) {
      this.id = id
      this.fetchBookDetail()
      this.showModal = true
      this.successCbs.push(...cbs)
    },
    fetchBookDetail () {
      this.loading = true
      getCopyPage({
        book: this.id
      }).then(res => {
        this.copies = res.results
      }).finally(() => {
        this.loading = false
      })
    },
    borrowBook (row) {
      borrowBook({
        book: this.id,
        copy: row.id,
        reader: this.currentBorrower.id
      }).finally(() => {
        this.fetchBookDetail()
        this.successCbs.map(i => i())
      })
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