<template>
  <div class="a-container">
    <div @click="$router.push('/dashboard/book-detail/' + book.id)" class="a-avatar-wrapper">
      <img class="a-avatar" :src="book.cover" alt="">
    </div>

    <div class="rest-info">
      <h4>
        <span>{{book.title}}</span>
      </h4>
      <p>
        <span class="a-info">
          <router-link class="link-item" :to="'/dashboard/author-detail/' + i.id" v-for="i in book.authors_info" :key="i.id">
            <span class="avatar-wrapper" :style="{ 'background-image': 'url(' + i.avatar + ')' }" >

            </span>
            <span>{{i.name}}</span>
          </router-link>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  props: {
    book: Object
  },
  data () {
    return {

    }
  },

  methods: {

  }
};
</script>


<style scoped>
.a-container {
  padding: 10px;
}
.rest-info {
  flex: 1;
  margin-left: 10px;
  position: relative;
}
.a-avatar-wrapper {
  height: 200px;
  width: 140px;
  background: #ccc;
  text-align: center;
  line-height: 150px;
  font-size: 0;
}

.a-tit {
  font-weight: 600;
  font-size: 16px;
  text-transform: capitalize;
  color: #555;
  display: inline-block;
  margin-top: 2px;
}
.a-info {
  color: #666;
  font-size: 13px;
  /* margin-left: 10px; */
}

.detail-profile {
  margin-top: 10px;
}
.handler-wrapper {
  position: absolute;
  opacity: 0;
  top: 10px;
  right: 10px;
}


.link-item + .link-item {
  margin-left: 20px;
}

</style>
