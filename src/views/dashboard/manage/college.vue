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
          <span>{{scope.row[i.prop]}}</span>
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
import { getCollegePage, addCollege, editCollege, deleteCollege } from "@api";

import AddModal from "@c/AddModal.vue";
export default {
  name: "author",
  components: { AddModal },
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
        }
      ],
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
      addCollege(data).then(() => {
        this.refreshTable();
      });
    },
    editEvent (data) {
      editCollege(data).then(() => {
        this.refreshTable();
      });
    },
    refreshTable(pageNum = 1) {
      getCollegePage({
        page: pageNum,
      }).then((res) => {
        const { count: total, results: list } = res;
        this.total = total;
        this.tableData = list;
      });
    },
    handleDelete(row) {
      deleteCollege(row.id).then(() => {
        this.refreshTable()
      })
    },
    handleEdit (row) {
      this.$refs.modal.edit({...row})
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
</style>
