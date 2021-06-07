<template>
  <div class="container">

    <div class="nav-wrap nav">
      <div class="nav-primary">
        <div class="nav-logo">
        </div>
        <div class="nav-search">
          <el-input size="small" placeholder="enter keywords" v-model="key">
            <template slot="append"><el-button type="primary" @click="searchBook" icon="el-icon-search">Search</el-button></template>
          </el-input>
        </div>
      </div>
    </div>

    <div class="work-banch">
      <AddModal
        :formModal="formModal"
        flex
        @addEvent="addEvent"
        @editEvent="editEvent"
        ref="modal"
      >
        <CopyBookForm ref="copyForm"></CopyBookForm>
      </AddModal>
      <SelectBorrowPeople @selectedBorrower="onSelectedBorrower" />
    </div>
    <div>

    </div>
    <div>
      <BookItem class="item" v-for="i in tableData" @onBorrow="onBorrow(i)" @showDetail="showDetail(i)" @onEdit="handleEdit(i)" @onDelete="handleDelete(i)" :book="i" :key="i.id" />
    </div>
    <BorrowModal :currentBorrower="currentBorrower" ref="borrowModal" />
  </div>
</template>

<script>
import { getBookPage, addBook, editBook, deleteBook, getAuthorPage, getPublisherPage, bookSearch } from '@api'
import { mapGetters } from 'vuex'
import BookItem from '@c/BookItem.vue'
import AddModal from '@c/AddModal.vue'
import CopyBookForm from '@c/CopyBookForm.vue'
import SelectBorrowPeople from '@c/SelectBorrowPeople'
import BorrowModal from '@c/BorrowModal'
export default {
  name: "book",
  components: { AddModal, BookItem, CopyBookForm, SelectBorrowPeople, BorrowModal },
  data() {
    return {
      tableData: [],
      total: 0,
      key: '',
      promotionPrice: '',
      authorOptions: [],
      publisherOptions: [],
      currentBorrower: null
    };
  },
  computed: {
    ...mapGetters(['getBindingsOptions', 'getSubjectsOptions', 'getLanguages']),
    formModal () {
      return [
        {
          label: 'Title',
          prop: 'title',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input'
        },
        {
          label: 'Language',
          prop: 'language',
          rules: [
            { required: true, trigger: 'change'}
          ],
          type: 'select',
          attrs: {
            options: this.getLanguages
          }
        },
        {
          label: 'Subject',
          prop: 'subject',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'select',
          attrs: {
            options: this.getSubjectsOptions
          }
        },
        {
          label: 'Cover',
          prop: 'cover',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input'
        },
        {
          label: 'ISBN 10',
          prop: 'isbn_10',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input'
        },
        {
          label: 'ISBN 13',
          prop: 'isbn_13',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input'
        },
        {
          label: 'Publisher',
          prop: 'publisher',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'select',
          attrs: {
            options: this.publisherOptions,
            multiple: false,
            remote: this.getPublisherList
          }
        },
        {
          label: 'Publication Date',
          prop: 'publication_date',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'datePicker'
        },
        {
          label: 'Authors',
          prop: 'authors',
          rules: [
            { required: true, trigger: 'blur' }
          ],
          type: 'select',
          attrs: {
            options: this.authorOptions,
            multiple: true,
            remote: this.getAuthorList
          }
        },
        {
          label: 'Price',
          prop: 'price',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input'
        },
        {
          label: 'Print Length',
          prop: 'print_length',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input'
        },
        {
          label: 'Binding',
          prop: 'binding',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'select',
          attrs: {
            options: this.getBindingsOptions
          }
        },
        {
          label: 'Toc',
          prop: 'toc',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input',
          attrs: {
            type: 'textarea'
          }
        },
        {
          label: 'Description',
          prop: 'description',
          rules: [
            { required: true, trigger: 'change' }
          ],
          type: 'input',
          attrs: {
            type: 'textarea'
          }
        }
      ]
    },
  },
  watch: {},
  created() {
    this.refreshTable();
    console.log(this, '000')
  },
  mounted() {},
  destroyed() {},
  methods: {
    async addEvent(data) {
      const copies = await this.$refs.copyForm.getCopy()
      addBook({
        ...data,
        copies
      }).then(() => {
        this.refreshTable();
      });
    },
    editEvent (data) {
      editBook(data).then(() => {
        this.refreshTable();
      });
    },
    refreshTable(pageNum = 1) {
      getBookPage({
        page: pageNum,
      }).then((res) => {
        const { count: total, results: list } = res;
        this.total = total;
        this.tableData = list;
      });
    },
    handleDelete(row) {
      deleteBook(row.id).then(() => {
        this.refreshTable()
      })
    },
    handleEdit (row) {
      this.$refs.modal.edit({...row})
    },
    showDetail () {

    },
    async getAuthorList (k) {
      const res = await getAuthorPage({
        page: 1,
        name: k
      })
      this.authorOptions = res.results.map(i => ({
        value: i.id,
        label: i.name
      }))
    },
    async getPublisherList (k) {
      const res = await getPublisherPage({
        page: 1,
        keywords: k
      })
      this.publisherOptions = res.results.map(i => ({
        value: i.id,
        label: i.name
      }))
    },
    async searchBook () {
      const res = await bookSearch({
        q: this.key
      })
      this.tableData = res.results;
    },
    async getAuthorPage () {

    },
    onSelectedBorrower (user) {
      this.currentBorrower = user
    },
    onBorrow (i) {
      if (this.currentBorrower) {
        this.$refs.borrowModal.show(i.id)
      }
    }
  },
};
</script>


<style scoped>
.page-wrapper {
  text-align: right;
  margin: 10px;
}
.nav {
  border-color: #e3ebec;
  border-bottom: 1px solid #e5ebe4;
  background-color: #f0f3f5;
}
.nav .nav-primary {
  width: 1040px;
  margin: 0 auto;
  display: flex;
  position: relative;
  padding: 10px 0 5px;
  zoom: 1;
  
}
.nav .nav-logo {
  height: 56px;
  line-height: 56px;
  margin: 0 20px 0 0;
}
.nav-search {
  width: 500px;
  padding: 10px 0 15px 0;
}
.item + .item{
  margin-top: 20px;
}
.work-banch {
  padding: 10px;
}
</style>
