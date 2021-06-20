import { getBookPage, searchBook, searchBookComplete } from '@api'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      key: '',
      timer: 0,
      searchResult: [],
      visible: false
    }
  },
  mounted () {
    window.addEventListener('click', this.checkClick)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.checkClick)
  },
  methods: {
    refreshTable (pageNum = 1, title = '') {
      clearTimeout(this.timer)
      this.visible = false
      getBookPage({
        page: pageNum,
        title
      }).then((res) => {
        const { count: total, results: list } = res
        this.total = total
        this.tableData = list
      })
    },
    searchBook (page = 1) {
      clearTimeout(this.timer)
      this.visible = false
      if (this.key) {
        searchBook({
          text: this.key,
          page: page
        }).then(res => {
          const { count: total, results: list } = res;
          this.total = total;
          this.tableData = list;
        })
      } else {
        this.refreshTable(1)
      }
    },
    pageChange(page) {
      this.key ? this.searchBook(page) : this.refreshTable(page)
    },
    searchBookComplete () {
      if (!this.timer) {
        this.completeSearch()
        this.timer = setTimeout(() => {
          this.timer = 0
          this.completeSearch()
        }, 1000)
      }
    },
    completeSearch () {
      searchBookComplete({q: this.key}).then(res => {
        this.searchResult = res.results
        if (this.searchResult.length) {
          this.visible = true
        } else {
          this.visible = false
        }
      })
    },
    checkClick (e) {
      const drop = document.querySelector('#drop')
      if (drop && !drop.contains(e.target) && e.target.localName  !== 'input') {
        this.visible = false
      }
    },
    quickSearch (i) {
      this.total = 1
      this.tableData = [i]
      this.visible = false
    }
  }
}