<template>
  <div class="container">
  

  </div>
</template>

<script>
import { getAuthorPage, addAuthor, editAuthor, deleteAuthor } from "@api";

export default {
  name: "author",
  components: { AddModal, AuthorItem, AuthorDetailModal },
  data() {
    return {
    };
  },
  watch: {},
  created() {
  },
  mounted() {},
  destroyed() {},
  methods: {
  },
};
</script>


<style scoped>
.page-wrapper {
  text-align: right;
  margin: 10px;
}
</style>
