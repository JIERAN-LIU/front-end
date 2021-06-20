<template>
  <span>
    <el-button @click="showModal = true"> Add </el-button>
    <el-dialog :title="isEdit ? 'EDIT' : 'ADD'" :custom-class="flex ? 'flex-dialog add-modal' : 'add-modal'" destroy-on-close :visible.sync="showModal" @open="open" @closed="closed">
      <el-form :class="flex ? 'flex-form' : ''" ref="addForm" :model="addForm" :rules="lazyAddRules" label-position="left" label-width="135px">
        <el-form-item :label="i.label" v-for="i in formModal" :key="i.prop" :prop="i.prop">
          <el-input v-if="i.type === 'input'" :ref="i.prop" v-model="addForm[i.prop]" :placeholder="i.label" @blur="addForm[i.prop] = addForm[i.prop].trim()" :type="i.attrs && i.attrs.type" />
          <el-input v-if="i.type === 'pic'" :ref="i.prop" v-model="addForm[i.prop]" :placeholder="i.label" :type="i.attrs && i.attrs.type">
            <template slot="append">
              <el-upload class="upload-demo" accept=".png, .jpg, .jpeg" :on-success="res => uploadSuccess(res, i)" :headers="{ Authorization: auth }" :action="actionUrl">
                <el-button size="mini" type="primary">Upload</el-button>
              </el-upload>
            </template>
          </el-input>
          <el-select v-if="i.type === 'select'" v-model="addForm[i.prop]" style="width: 100%;" :remote="!!i.attrs.remote" :multiple="!!i.attrs.multiple" filterable placeholder="Input keywords to search" :remote-method="i.attrs.remote">
            <el-option v-for="item in i.attrs.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker style="width: 100%;" value-format="yyyy-MM-dd" v-if="i.type === 'datePicker'" v-model="addForm[i.prop]" type="date" placeholder="Select Date">
          </el-date-picker>
        </el-form-item>
        <slot></slot>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">Cancel</el-button>
        <el-button type="primary" @click="ok">OK</el-button>
      </span>
    </el-dialog>
  </span>
</template>


<script>
import PicChooseModal from './PicChooseModal'
export default {
  components: {
    PicChooseModal
  },
  data () {
    return {
      showModal: false,
      addForm: {},
      isEdit: false,
      console: window.console,
      lazyAddRules: null,
      cbs: [],
      actionUrl: process.env.NODE_ENV === 'production' ? '/upload/' : '/api/upload/',
      auth: localStorage.getItem('Authorization'),
    };
  },
  props: {
    formFormat: Array,
    formModal: Array,
    flex: Boolean
  },
  computed: {},
  watch: {
    formModal: {
      handler (v) {
        const obj = {}
        v && v.forEach(i => {
          i.rules && i.rules[0] && (i.rules[0].message = `${i.label} is required`)
          obj[i.prop] = i.rules
        })
        this.lazyAddRules = this.lazyAddRules || obj
        Object.assign(this.lazyAddRules, obj)
        this.$refs.addForm && this.$refs.addForm.clearValidate()
      },
      immediate: true
    },
  },

  methods: {
    open () {
      this.formModal.map(i => {
        i.attrs && i.attrs.remote && i.attrs.remote()
      })
    },
    closed () {
      this.isEdit = false;
      this.addForm = this.formModal.reduce((res, item) => {
        res[item.prop] = "";
        return res;
      }, {});
      setTimeout(() => {
        this.$refs.addForm.clearValidate()
      })
      this.cbs.map(i => i())
      this.cbs = []
    },
    ok () {
      this.$refs.addForm.validate((val) => {
        if (val) {
          this.$emit(this.isEdit ? "editEvent" : "addEvent", {
            ...this.addForm,
          });
          this.showModal = false;
        }
      });
    },
    edit (info, cbs = []) {
      this.isEdit = true;
      this.showModal = true;
      setTimeout(() => {
        this.addForm = info;
      });
      this.cbs.push(...cbs)
    },
    uploadSuccess (res, row) {
      this.$set(this.addForm, row.prop, res.url)
    }
  },
};
</script>

<style scoped>
.flex-form {
  display: flex;
  flex-wrap: wrap;
}
.flex-form .el-form-item {
  width: 47%;
}
.flex-form .el-form-item:nth-child(even) {
  padding-left: 10px;
}
.flex-form .el-form-item:nth-child(odd) {
  padding-right: 10px;
}
</style>
<style>
.flex-dialog {
  min-width: 900px;
}
.el-dialog.add-modal {
  max-width: 600px;
}
.el-dialog.add-modal .el-select {
  width: 100%;
}
</style>