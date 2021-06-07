<template>
  <div class="single-page">
    <AuthorItem v-loading="loading" :author="author" mode="detail"/>
    <!-- <div class="info-list-wrapper">
      <p class="info-title"><span>Comments</span></p>
      <div class="single-comment" v-for="c in comments" :key="c.id">
        <img class="user" :src="`https://plchldr.co/i/40x40?text=${c.content[0].toUpperCase()}`" alt="">
        <div>
          <p>{{timeFormat(c.created_at)}}</p>
          <el-rate
            :value="c.rating"
            disabled
            :max="10"
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
          <p>
            <span>{{c.content}}</span>
          </p>
        </div>
      </div>
    </div> -->
    <div class="info-list-wrapper">
      <p class="info-title"><span>Related Books</span><router-link class="more" :to="'/dashboard/book?author=' + $route.params.id">MORE >></router-link></p>
      <BookItem v-for="b in relatedBooks" :key="b.id" :book="b" :author="$route.params.id" />
    </div>
  </div>
  
</template>

<script>
import AuthorItem from '@c/AuthorItem'
import BookItem from  '@c/BookItem'
import { getAuthorDetail, getComment, getBookPage } from '@api'
export default {
  name: "auhorDetail",
  components: {
    AuthorItem,
    BookItem
  },
  data() {
    return {
      loading: true,
      author: {},
      comments: [],
      relatedBooks: []
    };
  },
  created () {
    this.getAuthorDetail()
    this.getAuthorComment()
    this.getBookList()
  },
  mounted() {

  },
  computed: {
  },
  methods: {
    getAuthorDetail () {
      this.loading = true
      getAuthorDetail(this.$route.params.id).then(res => {
        this.author = res
      }).finally(() => {
        this.loading = false
      })
    },
    getAuthorComment () {
      getComment({
        user: this.$route.params.id
      }).then(res => {
        this.comments.push(...res.results)
      })
    },
    timeFormat (time) {
      return time.slice(0, 19).replace('T', ' ')
    },
    getBookList () {
      getBookPage({
        author: this.$route.params.id
      }).then(res => {
        this.relatedBooks = res.results
      })
    }
  },
  beforeRouteUpdate (from, to, next) {
    this.comments = []
    this.author = {}
    this.relatedBooks = []
    this.$nextTick(() => {
      this.getAuthorDetail()
      this.getAuthorComment()
      this.getBookList()
    })
    next()
  }
};
</script>


<style scoped>
.single-page {
  width: 1000px;
  margin: 10px auto;
}
.info-list-wrapper {
  padding-left: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  background: #f4f4f4;
}
.single-comment {
  color: #404040;
  font-size: 14px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
  display: flex;
}
.total {
  font-size: 13px;
  color: #404040;
}
.info-title {
  /* margin-bottom: 16px; */
  padding: 0 12px;
  border-left: 4px solid #ec7259;
  font-size: 18px;
  font-weight: 500;
  height: 20px;
  line-height: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.user {
  width: 40px;
  height: 40px;
  border: 1px solid #eee;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.more {
  font-size: 14px;
}
</style>
