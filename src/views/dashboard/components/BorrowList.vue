<template>
  <div v-loading="loading" class="borrow-list-warpper">
    <h3 class="borrow-title">Borrow History</h3>
    <el-timeline >
      <el-timeline-item
        placement="top"
        v-for="item in borrowList"
        :key="item.id"
        :icon="getIcon(item)"
        :type="getType(item)"
        :timestamp="timeFormat(item.borrowed_at)">
        <div>
          <el-card class="">
            <h4><router-link :to="'./book-detail/' + item.book_info.id">{{item.book_info.title}}</router-link></h4>
            <p v-if="item.remain_days && !item.has_returned">
              <span>Remain Days: </span>
              <span class="remain-days"><vns :start="0" :end="item.remain_days" :times="4" :speed="100"/></span>
            </p>
            <p v-if="item.overdue_days && !item.has_returned">
              <span>Overdue Days: </span>
              <span class="overdue-days"><vns :start="0" :end="item.overdue_days" :times="4" :speed="100"/></span>
            </p>
            <p><span>Borrowed At: </span><span class="grey-item">{{timeFormat(item.borrowed_at)}}</span></p>
            <p v-if="item.returned_at"><span>Returned At: </span><span class="grey-item">{{timeFormat(item.returned_at)}}</span></p>
            <p class="handler-wrapper">
              <el-popconfirm
                v-if="!item.has_returned && !item.has_renewed && !item.has_overdue && $store.getters.isLibrarian"
                title="Confirm to renew?"
                confirm-button-text='OK'
                cancel-button-text='NO'
                style="margin-left: 10px"
                @confirm="handleRenew(item.id)"
              >
                <el-button slot="reference" type="primary" size="mini">Renew</el-button>
              </el-popconfirm>
              <template v-if="!item.has_returned && $store.getters.isLibrarian">
                <el-button v-if="item.has_overdue && !item.has_fined" @click="showFineModal(item)" type="success" size="mini">Overdue</el-button>
                <el-popconfirm
                  v-else
                  title="Confirm to return?"
                  confirm-button-text='OK'
                  cancel-button-text='NO'
                  style="margin-left: 10px"
                  @confirm="handleReturn(item.id)"
                >
                  <el-button slot="reference" type="success" size="mini">Return</el-button>
                </el-popconfirm>
              </template>
            </p>
          </el-card>
        </div>
      </el-timeline-item>
    </el-timeline>
    <FineModal @fine="fineUpdate" ref="FineModal"/>
  </div>
</template>

<script>
import { getBorrowList, renew, returnBook, fineUpdate } from "@api";
import vns from "vue-number-scroll"
import FineModal from './FineModal.vue'
export default {
  name: "borrowList",
  props: {
    rid: Number
  },
  components: {
    vns,
    FineModal
  },
  data() {
    return {
      loading: false,
      borrowList: [],
      page: 1,
      next: null
    };
  },
  created () {
    this.getBorrowList()
  },
  watch: {
    rid() {
      this.page = 1
      this.getBorrowList()
    }
  },
  methods: {
    getBorrowList (refresh) {
      const id = this.rid || this.$store.getters.getUserInfo.id
      this.loading = true
      getBorrowList({
        reader: id,
        page: refresh ? (this.page = 1) : this.page
      }).then(res => {
        this.page++
        this.borrowList = res.results
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
    handleRenew (id) {
      renew(id).finally(() => {
        this.borrowList = []
        this.next = null
        this.page = 1
        this.getBorrowList()
      })
    },
    handleReturn (id) {
      returnBook(id).finally(() => {
        this.borrowList = []
        this.next = null
        this.page = 1
        this.getBorrowList()
      })
    },
    showFineModal ({ fine, id }) {
      this.$refs.FineModal.show({
        fine,
        id
      })
    },
    fineUpdate (form) {
      fineUpdate(form).finally(() => {
        this.borrowList = []
        this.next = null
        this.page = 1
        this.getBorrowList()
      })
    }
  }
};
</script>


<style scoped>
.borrow-list-warpper {
  height: 100%;
}
.borrow-title {
  margin-bottom: 10px;
}
.handler-wrapper {
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 10px;
  text-align: right;
}
.remain-days, .overdue-days {
  font-size: 16px;
  font-weight: 600;
  color: #409EFF
}
.overdue-days {
  color: #f40
}
.grey-item {
  color: #aaa;
}
</style>
<style>
.borrow-list-warpper .el-timeline-item__timestamp::before {
  content: 'Borrowed At: ';
}
</style>
