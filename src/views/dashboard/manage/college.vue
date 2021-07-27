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
import tableMixin from '../mixins/table.search'
export default {
  name: "author",
  mixins: [tableMixin],
  components: { AddModal },
  data() {
    return {
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
      searchKey: 'name'
    };
  },
  watch: {},
  created() {
    this.refreshTable();
  },
  mounted() {},
  destroyed() {},
  methods: {
    getPage: getCollegePage,
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
