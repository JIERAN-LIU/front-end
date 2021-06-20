<template>
  <div class="container">
    <div class="work-bench">
      <AddModal
        :formModal="formModal"
        @addEvent="addEvent"
        @editEvent="editEvent"
        ref="modal"
      />
    </div>

    <div class="content-wrapper">
      <AuthorItem v-for="i in tableData" @showDetail="showDetail(i)" @onEdit="handleEdit(i)" @onDelete="handleDelete(i)" :author="i" :key="i.id"/>
      <p class="page-nation">
          <el-pagination background layout="prev, pager, next" @current-change="refreshTable" :total="total">
          </el-pagination>
        </p>
    </div>

    <AuthorDetailModal :author="activeAuthor" :showInfo.sync="detailShow" />

  </div>
</template>

<script>
import { getAuthorPage, addAuthor, editAuthor, deleteAuthor } from "@api";
import { mapGetters } from 'vuex'
import AddModal from "@c/AddModal.vue";
import AuthorItem from "@c/AuthorItem.vue"
import AuthorDetailModal from "@c/AuthorDetailModal.vue"
export default {
  name: "author",
  components: { AddModal, AuthorItem, AuthorDetailModal },
  data() {
    return {
      tableData: [],
      total: 0,
      activeAuthor: null,
      detailShow: false,
      promotionPrice: ''
    };
  },
  computed: {
    ...mapGetters(['getNationsOptions', 'getGendersOptions']),
    formModal() {
      return [
        {
          label: 'Name',
          prop: 'name',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        },
        {
          label: 'Gender',
          prop: 'gender',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'select',
          attrs: {
            options: this.getGendersOptions
          }
        },
        {
          label: 'Alias',
          prop: 'alias',
          rules: [],
          type: 'input'
        },
        {
          label: 'Nation',
          prop: 'nation',
          rules: [
            { required: true, trigger: 'blur' }
          ],
          type: 'select',
          attrs: {
            options: this.getNationsOptions
          }
        },
        {
          label: 'Avatar',
          prop: 'avatar',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'pic'
        },
        {
          label: 'Profile',
          prop: 'profile',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        },
        {
          label: 'Birthday',
          prop: 'birthday',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'datePicker'
        },
        {
          label: 'Died At',
          prop: 'died_at',
          rules: [],
          type: 'datePicker'
        }
      ]
    }
  },
  watch: {},
  created() {
    this.refreshTable();
  },
  mounted() {},
  destroyed() {},
  methods: {
    addEvent(data) {
      addAuthor(data).then(() => {
        this.refreshTable();
      });
    },
    editEvent (data) {
      editAuthor(data).then(() => {
        this.refreshTable();
      });
    },
    refreshTable(pageNum = 1) {
      getAuthorPage({
        page: pageNum,
      }).then((res) => {
        const { count: total, results: list } = res;
        this.total = total;
        this.tableData = list;
      });
    },
    handleDelete(row) {
      deleteAuthor(row.id).then(() => {
        this.refreshTable()
      })
    },
    handleEdit (row) {
      this.$refs.modal.edit({...row})
    },
    showDetail (a) {
      this.activeAuthor = a
      this.detailShow = true
    }
  },
};
</script>


<style scoped>
.page-wrapper {
  text-align: right;
  margin: 10px;
}
.work-bench {
  padding: 10px;
}
.page-nation {
  text-align: right;
  margin-top: 10px;
}
.content-wrapper {
  margin-bottom: 20px;
}
</style>
