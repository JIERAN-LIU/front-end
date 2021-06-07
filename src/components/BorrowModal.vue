<template>
  <el-dialog
    title="Add Copy"
    destroy-on-close
    append-to-body
    width="60%"
    :visible.sync="showModal"
  >
    <el-table style="width: 100%" :data="this.copies">
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
      <el-button type="primary" @click="ok">OK</el-button>
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
      book: null,
      copies: []
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
    show (id) {
      this.id = id
      this.fetchBookDetail()
      this.showModal = true
    },
    fetchBookDetail () {
      this.loading = true
      Promise.all([
        getBookDetail(this.id),
        getCopyPage({
          book: this.id
        }),
      ]).then(([res1, res2]) => {
        this.book = res1
        this.copies = res2.results
      }).finally(() => {
        this.loading = false
      })
    },
    ok () {

    },
    borrowBook (row) {
      borrowBook({
        book: this.id,
        copy: row.id,
        reader: this.currentBorrower.id
      }).finally(() => {
        this.fetchBookDetail()
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