<template>
  <div class="container">
    <div>
      <AddModal
        :formModal="formModal"
        @addEvent="addEvent"
        @editEvent="editEvent"
        ref="modal"
      />
    </div>

    <div>
      <AuthorItem v-for="i in tableData" @showDetail="showDetail(i)" @onEdit="handleEdit(i)" @onDelete="handleDelete(i)" :author="i" :key="i.id"/>
    </div>

    <!-- <el-table :data="tableData" style="width: 100%">

      <el-table-column :label="i.label" :prop="i.prop" v-for="i in formModal" :key="i.prop">
        <template slot-scope="scope">
          <img v-if="i.prop === 'avatar'" style="max-width: 200px;max-height: 200px" :src="scope.row.avatar" alt="">
          <span v-else>{{scope.row[i.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Handle" width="300px">
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
        </template>
      </el-table-column>
    </el-table> -->
    <!-- <p class="page-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="refreshTable"
        :total="total"
      >
      </el-pagination>
    </p> -->

    <AuthorDetailModal :author="activeAuthor" :showInfo.sync="detailShow" />

  </div>
</template>

<script>
import { getAuthorPage, addAuthor, editAuthor, deleteAuthor } from "@api";

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
      formModal: [
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
          type: 'input'
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
            { required: true, trigger: "blur" }
          ],
          type: 'input'
        },
        {
          label: 'Avatar',
          prop: 'avatar',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'input'
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
          type: 'input'
        },
        {
          label: 'Died At',
          prop: 'died_at',
          rules: [],
          type: 'input'
        }
      ],
      activeAuthor: null,
      detailShow: false,
      promotionPrice: ''
    };
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
</style>
