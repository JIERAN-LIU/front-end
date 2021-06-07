<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getDictionary } from '@api'
export default {
  name: "App",
  created () {
    getDictionary().then(res => {
      this.$store.commit('setDic', res)
    })
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  height: 100%;
}
.container {
  box-sizing: border-box;
}
</style>
