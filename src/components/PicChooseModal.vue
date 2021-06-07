<template>
  <span>
    <el-button @click="showModal = true"> Add </el-button>
    <el-dialog
      title="Choose a picture"
      destroy-on-close
      :visible.sync="showModal"
      @open="open"
      append-to-body
      width="900px"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
      >
        <el-form-item prop="url">
          <el-radio-group v-model="addForm.url">
            <PicArea :isChoosing="true"/>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">Cancel</el-button>
        <el-button type="primary" @click="ok"
          >OK</el-button
        >
      </span>
    </el-dialog>
  </span>
</template>


<script>
import PicArea from './PicArea'
export default {
  components: {
    PicArea
  },
  data() {
    return {
      showModal: false,
      addForm: {
        url: ''
      },
      addRules: {
        url: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ]
      }
    };
  },

  methods: {
    open() {
      this.addForm = {
        url: ''
      }
    },
    ok() {
      
    }
  },
};
</script>