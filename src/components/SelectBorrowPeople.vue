<template>
  <span>
    <el-button @click="showModal = true"> Select Borrower </el-button>
    <el-dialog
      title="Select Borrower"
      destroy-on-close
      :visible.sync="showModal"
      @open="open"
      width="800px"
      @closed="closed"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRule"
        label-position="left"
        label-width="135px"
      >
        <el-form-item
          label="Borrower"
          prop="borrower"
        >
          <el-select
            v-model="form.borrower"
            remote
            filterable
            @focus="remote"
            placeholder="Input keywords to search"
            :remote-method="remote"
          >
            <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        Borrowed List:
        <el-table style="width: 100%" :data="borrowList">
          <el-table-column
            prop="book_info.title"
            label="Book"
            width="250">
          </el-table-column>
          <el-table-column
            prop="borrowed_at"
            width="150"
            label="Borrowed At">
          </el-table-column>
          <el-table-column
            prop="remain_days"
            width="100"
            label="Remain Days">
          </el-table-column>
          <el-table-column
            prop="fine"
            label="Fine"
            width="100">
          </el-table-column>
          <el-table-column
            label="Handle"
            fixed="right"
            width="90">
            <template slot-scope="scope">
              <el-button @click="returnBook(scope.row)" type="primary">Return</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">Cancel</el-button>
        <el-button type="primary" @click="ok">Next</el-button>
      </span>
    </el-dialog>
  </span>
</template>


<script>
import { getUserPage, getBorrowList, returnBook } from '@api'
export default {
  data() {
    return {
      showModal: false,
      form: {
        borrower: null
      },
      users: [],
      originUsers: [],
      formRule: {
        borrower: [{
          required: true, message: 'borrower is required'
        }]
      },
      page: 1,
      loading: false,
      borrowList: []
    };
  },
  props: {
  },
  computed: {},
  watch: {
    'form.borrower': {
      handler () {
        this.getBorrowList(true)
      }
    }
  },
  methods: {
    async remote (k) {
      const res = await getUserPage({
        page: 1,
        keywords: k
      })
      this.users = (this.originUsers = res.results).map(i => ({
        value: i.id,
        label: i.username + (i.student_id ? ` ( ${i.student_id} )` : '')
      }))
    },
    open() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    closed() {
      this.isEdit = false;
      this.form = {
        borrower: null
      }
      this.$refs.form.clearValidate()
    },
    ok() {
      this.$refs.form.validate((val) => {
        if (val) {
          const current = this.originUsers.find(i => i.id === this.form.borrower)
          this.$emit('selectedBorrower', current);
          this.showModal = false;
        }
      });
    },
    getBorrowList (refresh) {
      if (refresh) {
        this.page = 1
        this.borrowList = []
      }
      this.loading = true
      getBorrowList({
        reader: this.form.borrower,
        has_returned: false,
        page: this.page
      }).then(res => {
        this.page++
        this.borrowList = res.results
      }).finally(() => {
        this.loading = false
      })
    },
    returnBook (row) {
      returnBook(row.id).finally(() => {
        this.getBorrowList(true)
      })
    }
  },
};
</script>

<style scoped>
.flex-form {
  display: flex;
  flex-wrap: wrap;
}
.flex-form .el-form-item {
  width: 47%;
}
.flex-form .el-form-item:nth-child(even) {
  padding-left: 10px;
}
.flex-form .el-form-item:nth-child(odd) {
  padding-right: 10px;
}
</style>