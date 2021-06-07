<template>
  <span>
    <slot :change-display="() => showModal = true"></slot>
    <el-dialog
      title="Add Copy"
      destroy-on-close
      append-to-body
      :visible.sync="showModal"
      @open="open"
      @closed="closed"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-position="left"
        label-width="150px"
      >
        <el-form-item
          label="status"
          prop="status"
        >
          <el-select v-model="form.status">
            <el-option v-for="s in getBookStatus" :key="s.value" :label="s.label" :value="s.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="location"
          prop="location"
        >
          <el-input
            v-model="form.location"
            placeholder="location"
          />
        </el-form-item>
        <el-form-item
          label="section"
          prop="section"
        >
          <el-input
            v-model="form.section"
            placeholder="section"
          />
        </el-form-item>
        <el-form-item
          label="Media Type"
          prop="media_type"
        >
          <el-select v-model="form.media_type">
            <el-option v-for="m in getBookMediaTypes" :key="m.value" :label="m.label" :value="m.value"></el-option>
          </el-select>
        </el-form-item>
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
import { mapGetters } from 'vuex'

export default {
  components: {
    PicChooseModal
  },
  data() {
    return {
      mediaTypes: [],
      status: [],
      form: {
        status: '',
        location: '',
        section: '',
        media_type: ''
      },
      formRules: {
        status: [ { required: true, message: 'status is required', trigger: 'change' } ],
        location: [ { required: true, message: 'location is required', trigger: 'change' } ],
        section: [ { required: true, message: 'section is required', trigger: 'change' } ],
        media_type: [ { required: true, message: 'media type is required', trigger: 'change' } ]
      },
      showModal: false
    };
  },
  props: {
  },
  computed: {
    ...mapGetters(['getBookStatus', 'getBookMediaTypes']),
  },
  watch: {
  },

  methods: {
    open() {
      console.log(111)
    },
    closed() {
      this.form = {
        status: '',
        location: '',
        section: '',
        media_type: ''
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    ok() {
      this.$refs.form.validate((val) => {
        if (val) {
          this.showModal = false
          this.$emit('newCopy', {...this.form})
        }
      });
    },
    edit(info) {
    },
  },
};
</script>