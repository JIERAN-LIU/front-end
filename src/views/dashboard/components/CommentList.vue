<template>
  <div v-loading="loading" class="comment-list-warpper">
    <h3 class="comment-title">Comment History</h3>
    <el-timeline >
      <el-timeline-item
        placement="top"
        v-for="item in commentList"
        :key="item.id"
        :timestamp="timeFormat(item.created_at)">
        <div>
          <el-card class="">
            <h4><router-link :to="'/book-detail/' + item.book_info.id">{{item.book_info.title}}</router-link></h4>
            <p class="content">{{item.content}}</p>
            <p class="handler-wrapper" >
              <span>Rating:  <span class="score">{{item.rating}}</span></span>
              <el-popconfirm
                title="Confirm to delete?"
                confirm-button-text='OK'
                cancel-button-text='NO'
                style="margin-left: 10px"
                @confirm="handleDelete(item.id)"
              >
                <el-button slot="reference" type="danger" size="mini">Delete</el-button>
              </el-popconfirm>
            </p>
          </el-card>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div class="center" v-if="next">
        <span @click="getComment" class="pointer">
          <span>Load More</span><span class="more-h">>></span>
        </span>
      </div>
      <div class="center" v-else>
        <span class="plain">
          No More Result ...
        </span>
      </div>
  </div>
</template>

<script>
import { getComment, deleteComment } from "@api";
import vns from "vue-number-scroll"
export default {
  name: "commentList",
  components: {
    vns
  },
  data() {
    return {
      loading: false,
      commentList: [],
      next: null,
      page: 1
    };
  },
  created () {
    this.getComment()
  },
  methods: {
    getComment () {
      const info = JSON.parse(localStorage.getItem('user'))
      this.loading = true
      getComment({
        user: info.id,
        page: this.page
      }).then(res => {
        this.commentList.push(...res.results)
        this.page++
        this.next = res.next
      }).finally(() => {
        this.loading = false
      })
    },
    timeFormat (time) {
      return time.slice(0, 19).replace('T', ' ')
    },
    getIcon (item) {
      if (item.has_returned) {
        return 'el-icon-success'
      } else if (item.has_overdue) {
        return 'el-icon-warning'
      } else {
        return 'el-icon-more'
      }
    },
    getType (item) {
      if (item.has_returned) {
        return 'success'
      } else if (item.has_overdue) {
        return 'warning'
      } else {
        return 'primary'
      }
    },
    handleDelete (id) {
      deleteComment(id).finally(() => {
        this.commentList = []
        this.next = null
        this.page = 1
        this.getComment()
      })
    }
  }
};
</script>


<style scoped>
.comment-list-warpper {
  padding-bottom: 40px;
}
.comment-title {
  margin-bottom: 10px;
}
.handler-wrapper {
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex {
  display: flex;
}
.flex> div {
  flex: 1;
}
.grey-item {
  color: #aaa;
}
.content {
  color: #666;
  font-style: italic;
  text-indent: 2em;
  margin-top: 10px;
  z-index: 100;
  position: relative;
}
.score {
  font-family: Faster_One;
  font-size: 45px;
  color: #e71d1d;
  opacity: .5;
  margin-left: 10px;
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
</style>
<style>

</style>
