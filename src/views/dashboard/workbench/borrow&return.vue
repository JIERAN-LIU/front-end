<template>
  <div class="container">

    <div class="nav-wrap nav">
      <div class="nav-primary">

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
          <!-- <el-dropdown style="width: 100%">
            
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="i in searchResult" :key="i.id">{{i.title}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

        </div>
        <SelectBorrowPeople @selectedBorrower="onSelectedBorrower" />
      </div>

    </div>
    <div class="content-wrapper">
      <div class="book-info-wrapper">
        <BookItem class="item" v-for="i in tableData" @onBorrow="onBorrow(i)" :book="i" :key="i.id" workbench />
        <p class="page-nation">
          <el-pagination background layout="prev, pager, next" @current-change="pageChange" :total="total">
          </el-pagination>
        </p>
      </div>
      <div class="reader-info-wrapper">
        <div>
          <h3 class="title">Reader Info</h3>

          <div v-if="currentReader" class="info">
            <p><span class="title">username: </span> <span class="content">{{currentReader.username || '--'}}</span></p>
            <p><span class="title">email: </span> <span class="content">{{currentReader.email || '--'}}</span></p>
            <p><span class="title">student id: </span> <span class="content">{{currentReader.student_id || '--'}}</span></p>
            <p><span class="title">college: </span> <span class="content">{{currentReader.college || '--'}}</span></p>
          </div>
          <div v-else class="empty">
            No Data...
          </div>
        </div>
        <div v-if="currentReader">
          <BorrowList :rid="currentReader.id" ref="borrowList" />
        </div>
      </div>
    </div>
    <BorrowModal :currentBorrower="currentReader" ref="borrowModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BookItem from '@c/BookItem.vue'
import CopyBookForm from '@c/CopyBookForm.vue'
import SelectBorrowPeople from '@c/SelectBorrowPeople'
import BorrowModal from '@c/BorrowModal'
import BorrowList from '../components/BorrowList.vue'
import bookMixin from '../mixins/book.mixins'
export default {
  name: "book",
  components: { BookItem, CopyBookForm, SelectBorrowPeople, BorrowModal, BorrowList },
  mixins: [bookMixin],
  data () {
    return {
      currentReader: null
    };
  },

  computed: {
    ...mapGetters(['isReader']),
  },
  watch: {},
  created () {
    this.refreshTable();
  },
  mounted () { },
  destroyed () { },
  methods: {
    onSelectedBorrower (user) {
      this.currentReader = user
    },
    onBorrow (i) {
      if (this.currentReader) {
        this.$refs.borrowModal.show(i.id, [() => {
          this.$refs.borrowList.getBorrowList(true)
        }])
      } else {
        this.$message.warning('Please Select Reader First!')
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
  display: flex;
  position: relative;
  /* padding: 10px 0 5px; */
  zoom: 1;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
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
.content-wrapper {
  display: flex;
}
.book-info-wrapper {
  flex: 1;
}
.reader-info-wrapper {
  width: 350px;
  padding: 10px;
}
h2.title {
  border-bottom: 1px dashed #ccc;
}
.reader-info-wrapper .info .title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
.reader-info-wrapper .content {
  font-size: 13px;
  color: #999;
}
.empty {
  line-height: 200px;
  color: #ccc;
  text-align: center;
}
.page-nation {
  text-align: right;
  margin-top: 10px;
}
</style>
