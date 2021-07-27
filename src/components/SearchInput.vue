
<template>
  <el-input placeholder="search..." v-model="cVal" @blur="cVal = cVal.trim()" @keydown.native.enter="$emit('search', cVal.trim())" class="input-with-select">
    <el-button slot="append" @click="$emit('search', cVal.trim())" icon="el-icon-search"></el-button>
  </el-input>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      val: this.value
    }
  },
  computed: {
    cVal: {
      get () {
        return this.val
      },
      set (v) {
        this.val = v
        this.$emit('input', v)
      }
    }
  }
}
</script>
<style scoped>
.input-with-select {
  width: 200px;
  padding-left: 10px;
}
</style>
