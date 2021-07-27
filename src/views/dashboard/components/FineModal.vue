<template>
  <el-dialog title="Handle Overdue" destroy-on-close :visible.sync="showModal" @open="open" @closed="closed">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="135px">
      <el-form-item label="Fine" prop="fine">
        <el-input disabled v-model="form.fine" />
      </el-form-item>
      <el-form-item label="Pay Method" prop="pay_method">
        <el-select v-model="form.pay_method" style="width: 100%;">
          <el-option v-for="item in getPayMethodsOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showModal = false">Cancel</el-button>
      <el-button type="primary" @click="ok">OK</el-button>
    </span>
  </el-dialog>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showModal: false,
      form: {
        fine: '',
        currency_symbol: ''
      },
      rules: {
        fine: [
          { required: true, message: 'fine is required' }
        ],
        pay_method: [
          { required: true, message: 'pay method is required' }
        ],
        currency_symbol: [
          { required: true, message: 'currency symbol is required' }
        ]
      },
    };
  },
  computed: {
    ...mapGetters(['getPayMethodsOptions', 'getCurrencySymbolsOptions',]),
  },

  methods: {
    show({ fine, id }) {
      this.showModal = true
      this.form.fine = fine
      this.id = id
    },
    open () {
    },
    close () {
    },
    closed () {
    },
    ok () {
      this.$refs.form.validate(validate => {
        if (validate) {
          this.$emit('fine', { ...this.form, id: this.id })
          this.form = {
            fine: '',
            currency_symbol: ''
          }
          this.$refs.form.clearValidate()
          this.showModal = false
        }
      })
    },
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