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

    <p><SearchInput @search="key => refreshTable(1, key)" /></p>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="i.label" :prop="i.prop" v-for="i in formModal" :key="i.prop">
        <template slot-scope="scope">
          <img v-if="i.prop === 'avatar'" style="max-width: 80px;max-height: 80px" :src="scope.row.avatar" alt="">
          <span v-else-if="i.prop === 'college'" >{{scope.row.college_info.name}}</span>
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
            v-if="isAdmin"
          >
            <el-button slot="reference" size="mini" type="danger">DELETE</el-button>
          </el-popconfirm>
          <el-popconfirm
            title="confirm to disabled?"
            confirm-button-text='OK'
            cancel-button-text='NO'
            style="margin-left: 10px"
            @confirm="disabledUser(scope.row)"
            v-if="isLibrarian && scope.row.is_active"
          >
            <el-button slot="reference" size="mini" type="danger">DISABLED</el-button>
          </el-popconfirm>
          <el-popconfirm
            title="confirm to enabled?"
            confirm-button-text='OK'
            cancel-button-text='NO'
            style="margin-left: 10px"
            @confirm="enabledUser(scope.row)"
            v-if="isLibrarian && !scope.row.is_active"
          >
            <el-button slot="reference" size="mini" type="success">ENABLED</el-button>
          </el-popconfirm>
          <el-popconfirm
            title="confirm to reset password?"
            confirm-button-text='OK'
            cancel-button-text='NO'
            style="margin-left: 10px"
            @confirm="handleReset(scope.row)"
          >
            <el-button slot="reference" size="mini" type="warning">RESET PASSWORD</el-button>
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
import { LIBRARIAN, READER } from '../../../constant'
import tableMixin from '../mixins/table.search'
export default {
  name: "author",
  mixins: [tableMixin],
  components: { AddModal },
  data() {
    return {
      promotionPrice: '',
      collegeOptions: [],
      activeUser: {},
      searchKey: 'username'
    };
  },
  computed: {
    ...mapGetters(['isAdmin', 'isLibrarian']),
    formModal () {
      const staticOptions = [
        {
          label: 'Account',
          prop: 'username',
          rules: [
            { required: true, trigger: "blur" },
            { pattern: /^[0-9A-Za-z\@\.\+\-\_]+$/, message: 'Account contains only letters, numbers, and @/./+/-/_ characters', trigger: 'blur' }
          ],
          type: 'input'
        },
        {
          label: 'Name',
          prop: 'nickname',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        },
        {
          label: 'Email',
          prop: 'email',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        }
      ]
      const readerOptions = [
        {
          label: 'Avatar',
          prop: 'avatar',
          rules: [
            { required: true, trigger: "change" }
          ],
          type: 'pic'
        },
        {
          label: 'College',
          prop: 'college',
          type: 'select',
          rules: [
            { required: true, trigger: "change" }
          ],
          attrs: {
            options: this.collegeOptions,
            multiple: false,
            remote: this.getCollegeList
          }
        },
        {
          label: 'Student Id',
          prop: 'student_id',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        }
      ]
      if (this.isLibrarian) {
        staticOptions.push(...readerOptions)
      }
      return staticOptions
    }
  },
  watch: {},
  created() {
    this.refreshTable();
  },
  mounted() {},
  destroyed() {},
  methods: {
    getPage: getUserPage,
    addEvent(data) {
      addUser({
        ...data,
        role: this.isAdmin ? LIBRARIAN : READER
      }).then(() => {
        this.refreshTable();
      });
    },
    editEvent (data) {
      editUser(data).then(() => {
        this.refreshTable();
      });
    },
    disabledUser (data) {
      editUser({
        ...data,
        is_active: false
      }).then(() => {
        this.refreshTable();
      });
    },
    enabledUser (data) {
      editUser({
        ...data,
        is_active: true
      }).then(() => {
        this.refreshTable();
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
