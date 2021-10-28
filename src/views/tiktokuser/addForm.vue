<template>
  <div>
    <a-modal v-model="childDialogVisible" title="新增关注" width="400px" ok-text="确认" cancel-text="取消" @ok="handleAdd" @cancel="closeForm">
      <a-form ref="form" :model="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="执行任务的组">
          <a-input v-model="executive_group_name" @click="dialogGroupId = true" />
        </a-form-item>
        <a-form-item label="任务间隔时间">
          <a-input v-model="form.intervals"/>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="form.remark"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
  </div>
</template>

<script>
import * as api from '@/api/index'
import group from '@/components/group/index'
export default {
  components: {
    group
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tiktokUser: {
      type: Array,
      // eslint-disable-next-line space-before-function-paren
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      childDialogVisible: false,
      dialogGroupId: false,
      executive_group: [],
      form: {
        type: 3,
        executive_group: '',
        executives: '',
        tiktok_user: [],
        is_send_all: null,
        video: null,
        text: null,
        rich_text: null,
        remark: '',
        intervals: 3,
        image: null,
        name_card: null,
        gender: null
      },
      rich_text_form: {
        title: '',
        desc: '',
        avatar: '',
        link: '',
        text: ''
      },
      executive_group_name: ''
    }
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      this.form.remark = ''
      this.form.intervals = 3
      this.executive_group_name = []
      this.form.executive_group = ''
      this.childDialogVisible = newValue
    },
    childDialogVisible(newValue, oldValue) {
      if (!newValue) {
        this.executive_group_name = []
        this.form.executive_group = []
        this.$emit('closeForm')
      }
    }
  },
  methods: {
    /* getGroupId(id, name) {
      console.log(id)
      console.log(name)
      this.dialogGroupId = false
      this.executive_group_name = name
      this.form.executive_group = id
      this.form.executive_group.push(id)
      this.executive_group_name.push(name)
      if (this.form.executives !== '') {
        this.form.executives = this.form.executives + ',' + ids
      } else {
        this.form.executives = ids
      }
    }, */
    getGroupId(ids, name) {
      console.log(ids)
      console.log(name)
      if (this.form.executive_group !== '') {
        this.form.executive_group = this.form.executive_group + ',' + ids
        // this.executive_group_name = this.executive_group_name + ',' + name
        this.executive_group_name = this.executive_group_name + ',' + ids
      } else {
        this.form.executive_group = ids
        // this.executive_group_name = name
        this.executive_group_name = ids
      }
    },
    async handleAdd() {
      if (this.validateForm()) return
      let form = {}
      let executive = []
      if(typeof this.form.executive_group === 'number') {
        executive.push(this.form.executive_group)
      } else if(typeof this.form.executive_group === 'string') {
        executive = this.form.executive_group.split(",").map(Number)
      }
      form.type = 3
      form.belong = Number(this.userInfo.data.i)
      form.executive = executive
      form.follow_user = this.tiktokUser
      form.remark = this.form.remark
      form.intervals = Number(this.form.intervals)
      console.log(form)
      const res = await api.postTask(form)
      if (res && res.code === 0) {
        this.$emit('closeForm')
        this.$emit('success')
      }
    },
    closeForm() {
      this.executive_group_name = []
      this.form.executive_group = ''
      this.$emit('closeForm')
    },
    validateForm() {
      if (this.form.executive_group === '') {
        this.errorInfo('执行任务的组未选择')
        return true
      }
      return false
    },
    errorInfo(msg) {
      this.$message.error(msg)
    }
  }
}
</script>

<style lang="scss">
</style>
