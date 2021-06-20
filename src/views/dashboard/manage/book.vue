<template>
  <div class="container">

    <div class="nav-wrap nav" :class="{'fixed': isReader}">
      <div class="nav-primary">
        <div class="nav-logo">
        </div>
        <div class="nav-search">
          <el-popover placement="bottom" width="500" trigger="manual" :value="visible">
            <el-input slot="reference" size="small" placeholder="Enter keywords" @keydown.native.enter="searchBook()" @input="searchBookComplete" v-model="key">
              <template slot="append">
                <el-button type="primary" @click="searchBook()" icon="el-icon-search">Search</el-button>
              </template>
            </el-input>
            <ul id="drop" class="el-scrollbar__view el-select-dropdown__list">
              <li v-for="i in searchResult" :key="i.id" @click="quickSearch(i)" class="el-select-dropdown__item">
                <span>{{i.title}}</span>
              </li>
            </ul>
          </el-popover>
        </div>
      </div>
    </div>

    <div class="work-banch" v-if="!isReader">
      <AddModal :formModal="formModal" flex @addEvent="addEvent" @editEvent="editEvent" ref="modal">
        <CopyBookForm ref="copyForm"></CopyBookForm>
      </AddModal>
    </div>
    <div>
    </div>
    <div :class="{'fixed-book': isReader}" class="content-wrapper">
      <div class="book-info-wrapper" :class="{'is-reader': isReader}">
        <BookItem class="item" v-for="i in tableData" @showDetail="showDetail(i)" @onEdit="handleEdit(i)" @onDelete="handleDelete(i)" :book="i" :key="i.id" />
        <p class="page-nation">
          <el-pagination background layout="prev, pager, next" @current-change="pageChange" :total="total">
          </el-pagination>
        </p>
      </div>
      <div v-if="isReader" class="rec-info-wrapper">
        <h2 class="title-l">Books You May Interred In:</h2>
        <RecBook v-for="book in recommendList" :key="book.id" :book="book" />
      </div>
    </div>

  </div>
</template>

<script>
import { addBook, editBook, deleteBook, getAuthorPage, getPublisherPage, getCopyPage, getRecommend } from '@api'
import { mapGetters } from 'vuex'
import BookItem from '@c/BookItem.vue'
import AddModal from '@c/AddModal.vue'
import CopyBookForm from '@c/CopyBookForm.vue'
import RecBook from '@c/RecBook.vue'
import bookMixin from '../mixins/book.mixins'
export default {
  name: "book",
  mixins: [bookMixin],
  components: { AddModal, BookItem, CopyBookForm, RecBook },
  data () {
    return {
      authorOptions: [],
      publisherOptions: [],
      activeBook: {},
      recommendList: []
    };
  },
  computed: {
    ...mapGetters(['getBindingsOptions', 'getSubjectsOptions', 'getLanguages', 'isReader']),
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
            { required: true, trigger: 'change' }
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
          type: 'pic'
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
  created () {
    this.refreshTable();
    if (this.isReader) {
      this.getRecommend()
    }
  },
  mounted () { },
  destroyed () { },
  methods: {
    async addEvent (data) {
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
    handleDelete (row) {
      deleteBook(row.id).then(() => {
        this.refreshTable()
      })
    },
    handleEdit (row) {
      const info = {}
      this.formModal.map(i => {
        info[i.prop] = row[i.prop]
      })
      info.publisher = row.publisher_info.id
      info.authors = row.authors_info.map(i => i.id)
      info.id = row.id
      this.activeBook = row
      this.$refs.modal.edit(info, [() => {
        this.activeBook = {}
      }])
      getCopyPage({
        book: row.id
      }).then(res => {
        this.$refs.copyForm.setCopy(res.results)
      })

    },
    showDetail () {

    },
    async getAuthorList (k) {
      const res = await getAuthorPage({
        page: 1,
        name: k
      })
      if (!k && this.activeBook.authors_info) {
        res.results = res.results.filter(i => !this.activeBook.authors_info.find(j => j.id === i.id))
        res.results.unshift(...this.activeBook.authors_info)
      }
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
      if (!k && this.activeBook.publisher_info) {
        const exist = res.results.find(i => i.id === this.activeBook.publisher_info.id)
        !exist && res.results.unshift(this.activeBook.publisher_info)
      }
      this.publisherOptions = res.results.map(i => ({
        value: i.id,
        label: i.name
      }))
    },
    getRecommend () {
      getRecommend().then(res => {
        this.recommendList = res.results
      })
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
.item + .item {
  margin-top: 20px;
}
.work-banch {
  padding: 10px;
}
.fixed {
  position: absolute;
  width: calc(100vw - 15px);
  left: 0;
  top: 50px;
}
.fixed-book {
  margin-top: 90px;
}
.content-wrapper {
  display: flex;
  margin-bottom: 20px;
}
.book-info-wrapper {
  flex: 1;
}
.title-l {
  /* width: 100%; */
  padding-left: 10px;
}
.rec-info-wrapper {
  width: 350px;
  display: flex;
  margin-left: 10px;
  flex-wrap: wrap;
  align-self: baseline;
  justify-content: space-between;
}
.page-nation {
  text-align: right;
  margin-top: 10px;
}
</style>
