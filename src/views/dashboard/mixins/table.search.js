import SearchInput from "@c/SearchInput.vue";
export default {
  components: {
    SearchInput
  },
  data () {
    return {
      key: '',
      total: 0,
      tableData: []
    }
  },
  methods: {
    refreshTable(pageNum = 1, key = '') {
      this.key = key
      this.getPage({
        page: pageNum,
        [this.searchKey]: this.key
      }).then((res) => {
        const { count: total, results: list } = res;
        this.total = total;
        this.tableData = list;
      });
    },
  }
}