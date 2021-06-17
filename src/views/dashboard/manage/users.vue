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

    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="i.label" :prop="i.prop" v-for="i in formModal" :key="i.prop">
        <template slot-scope="scope">
          <img v-if="i.prop === 'avatar'" style="max-width: 200px;max-height: 200px" :src="scope.row.avatar" alt="">
          <span v-if="i.prop === 'college'" >{{scope.row.college_info.name}}</span>
          <span v-else>{{scope.row[i.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Handle" width="400px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)"
            >EDIT</el-button
          >
          <el-popconfirm
            title="confirm to delete?"
            confirm-button-text='OK'
            cancel-button-text='NO'
            style="margin-left: 10px"
            @confirm="handleDelete(scope.row)"
          >
            <el-button slot="reference" size="mini" type="danger">DELETE</el-button>
          </el-popconfirm>
          <el-popconfirm
            title="confirm to reset password?"
            confirm-button-text='OK'
            cancel-button-text='NO'
            style="margin-left: 10px"
            @confirm="handleReset(scope.row)"
          >
            <el-button slot="reference" size="mini" type="warning">RESER PASSWORD</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <p class="page-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="refreshTable"
        :total="total"
      >
      </el-pagination>
    </p>
  </div>
</template>

<script>
import { getUserPage, addUser, editUser, deleteUser, resetUser, getCollegePage } from "@api";
import AddModal from "@c/AddModal.vue";
import { mapGetters } from 'vuex'
import { ADMIN, LIBRARIAN, READER } from '../../../constant'
export default {
  name: "author",
  components: { AddModal },
  data() {
    return {
      tableData: [],
      total: 0,
      promotionPrice: '',
      collegeOptions: [],
      activeUser: {}
    };
  },
  computed: {
    ...mapGetters(['getIdentity']),
    getRoleOptions() {
      if (this.getIdentity === ADMIN) {
        return [{ value: LIBRARIAN, label: LIBRARIAN }]
      } else if (this.getIdentity === LIBRARIAN) {
        return [{ value: READER, label: READER }]
      }
      return []
    },
    formModal () {
      return [
        {
          label: 'Name',
          prop: 'username',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        },
        {
          label: 'Role',
          prop: 'role',
          rules: [
            { required: true, trigger: "change" }
          ],
          type: 'select',
          attrs: {
            options: this.getRoleOptions
          }
        },
        {
          label: 'Email',
          prop: 'email',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        },
        {
          label: 'College',
          prop: 'college',
          type: 'select',
          attrs: {
            options: this.collegeOptions,
            multiple: false,
            remote: this.getCollegeList
          }
        },
        {
          label: 'Student Id',
          prop: 'student_id',
          type: 'input'
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
      addUser(data).then(() => {
        this.refreshTable();
      });
    },
    editEvent (data) {
      editUser(data).then(() => {
        this.refreshTable();
      });
    },
    refreshTable(pageNum = 1) {
      getUserPage({
        page: pageNum,
      }).then((res) => {
        const { count: total, results: list } = res;
        this.total = total;
        this.tableData = list;
      });
    },
    handleDelete(row) {
      deleteUser(row.id).then(() => {
        this.refreshTable()
      })
    },
    handleEdit (row) {
      this.$refs.modal.edit({...row})
      this.activeUser = row
    },
    handleReset (row) {
      resetUser(row.id).then(() => {
        this.$message.success('success!')
        this.refreshTable()
      })
    },
    async getCollegeList (k) {
      const res = await getCollegePage({
        page: 1,
        keywords: k
      })
      if (!k && this.activeUser.college_info && this.activeUser.college_info.id) {
        const exist = res.results.find(i => i.id === this.activeUser.college_info.id)
        !exist && res.results.unshift(this.activeUser.college_info)
      }
      this.collegeOptions = res.results.map(i => ({
        value: i.id,
        label: i.name
      }))
    },
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
</style>
