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
          <img v-if="i.prop === 'logo'" style="max-width: 200px;max-height: 200px" :src="scope.row.logo" alt="">
          <a v-else-if="i.prop === 'site'" target="_blank" :href="scope.row.site">{{scope.row.site}}</a>
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
import { getPublisherPage, addPublisher, editPublisher, deletePublisher } from "@api";
import tableMixin from '../mixins/table.search'
import AddModal from "@c/AddModal.vue";
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
          label: 'Logo',
          prop: 'logo',
          rules: [
            { required: true, trigger: "blur" }
          ],
          type: 'pic'
        },
        {
          label: 'Site',
          prop: 'site',
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
    getPage: getPublisherPage,
    addEvent(data) {
      addPublisher(data).then(() => {
        this.refreshTable();
      });
    },
    editEvent (data) {
      editPublisher(data).then(() => {
        this.refreshTable();
      });
    },
    handleDelete(row) {
      deletePublisher(row.id).then(() => {
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
