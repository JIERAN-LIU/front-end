<template>
  <div class="single-page">
    <BookItem v-loading="loading" :book="book" mode="detail"/>
    <div v-loading="commentLoading" class="comment-wrapper">
      <div>
        <span class="w-c" @click="openComment = true"><span class="el-icon-edit"></span> write a comment</span>
        <div :class="openComment ? 'active' : ''" class="c-w">
          <div class="input-wrapper">
            <textarea v-model="text" class="input" :autosize="false" type="textarea"></textarea>
          </div>
          <p class="flex">
            <el-rate
              class="c-rating"
              v-model="rating"
              :max="10"
              show-score
              text-color="#ff9900"
              score-template="{value}">
            </el-rate>
            <span>
              <el-button class="w-button primary" @click="comment">Submit</el-button>
              <el-button class="w-button" @click="openComment = false">Cancel</el-button>
            </span>
          </p>
        </div>
      </div>
      <p class="all-comments"><span>All Comments<span class="total">{{total}}</span></span></p>
      <div class="single-comment" v-for="c in comments" :key="c.id">
        <!-- <img class="user" :src="" alt=""> -->
        <div class="user" :style="{ 'background-image': 'url(' + (c.user_info ? (c.user_info.avatar || `https://plchldr.co/i/40x40?text=${(c.user_info.name || c.content[0].toUpperCase()).slice(0,4).toUpperCase()}`) : `https://plchldr.co/i/40x40?text=${c.content[0].toUpperCase()}`) +')' }"></div>
        <div class="comment-right">
          <p>
            <span class="name" v-if="c.user_info">{{c.user_info.name}}</span>
            <span class="time">{{timeFormat(c.created_at)}}</span>
          </p>
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
      <div class="center" v-if="next">
        <span @click="getBookComment" class="pointer">
          <span>MORE</span><span class="more-h">>></span>
        </span>
      </div>
      <div class="center" v-else>
        <span class="plain">
          No more comment ...
        </span>
      </div>
    </div>
  </div>
  
</template>

<script>
import BookItem from '@c/BookItem'
import { getBookDetail, getComment, comment } from '@api'
export default {
  name: "bookDetail",
  components: {
    BookItem
  },
  data() {
    return {
      loading: true,
      book: {},
      comments: [],
      text: '',
      openComment: false,
      rating: 10,
      total: 0,
      userInfo: JSON.parse(localStorage.getItem('user')),
      page: 1,
      next: null,
      commentLoading: false
    };
  },
  created () {
    this.getBookDetail()
    this.getBookComment()
  },
  mounted() {

  },
  computed: {
  },
  methods: {
    getBookDetail () {
      getBookDetail(this.$route.params.id).then(res => {
        this.book = res
      }).finally(() => {
        this.loading = false
      })
    },
    getBookComment () {
      this.commentLoading = true
      getComment({
        book: this.$route.params.id,
        page: this.page
      }).then(res => {
        this.comments.push(...res.results)
        this.total = res.count
        this.next = res.next
        this.page++
      }).finally(() => {
        this.commentLoading = false
      })
    },
    timeFormat (time) {
      return time.slice(0, 19).replace('T', ' ')
    },
    comment () {
      comment({
        user: this.userInfo.id,
        book: Number(this.$route.params.id),
        content: this.text.trim(),
        rating: this.rating
      }).then(() => {
        this.page = 1
        this.text = ''
        this.openComment = false
        this.comments = []
        this.getBookComment()
      })
    }
  },
};
</script>


<style scoped>
.single-page {
  width: 1000px;
  margin: 10px auto;
}
.comment-wrapper {
  padding: 20px 10px; 
  background: #f4f4f4;
}
.single-comment {
  color: #404040;
  font-size: 14px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
  display: flex;
  border-bottom: 1px dashed #ddd;
  margin-bottom: 10px;
}
.total {
  font-size: 13px;
  color: #404040;
  margin-left: 10px;
  color: #888;
}
.all-comments {
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #ec7259;
  font-size: 18px;
  font-weight: 500;
  height: 20px;
  line-height: 20px;
  margin-top: 20px;
}
.user {
  width: 40px;
  height: 40px;
  border: 1px solid #eee;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.w-c {
  color: #409EFF;
  cursor: pointer;
  margin: 10px 0;
  font-size: 16px;
}
.w-c:hover {
  color: #2187ec;
}
.c-w {
  height: 0;
  transition: height .3s;
  overflow: hidden;
  width: 600px;
}
.c-w.active {
  height: 170px;
}
.flex {
  display: flex;
  margin-top: 10px;
  align-content: center;
  justify-content: space-between;
}
.input {
  padding: 12px 16px;
  width: 100%;
  height: 90px;
  font-size: 13px;
  border: none;
  resize: none;
  display: inline-block;
  vertical-align: top;
  outline-style: none;
  box-sizing: border-box;
}
.input-wrapper {
  padding-bottom: 30px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
}
.w-button {
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: all .2s cubic-bezier(.645,.045,.355,1);
  font-size: 14px;
  padding: 4px 12px;
  color: #969696;
  background-color: #fff;
  border: 1px solid #999;
}
.primary {
  color: #fff;
  background-color: #ec7259;
  border-color: #ec7259;
}
.center {
  text-align: center;
}
.more-h {
  transform: rotate(90deg) scale(0.7);
  display: inline-block;
  font-weight: 600;
}
.pointer {
  cursor: pointer;
}
.plain {
  color: #999
}
.name {
  font-size: 16px;
  font-weight: 600;
  padding-right: 10px;
}
.time {
  font-size: 13px;
  color: #888;
}
.c-rating {
  position: relative;
  top: -40px;
  left: 10px;
}
.comment-right {
  flex: 1;
}
</style>
