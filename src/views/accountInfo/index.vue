<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="用户名">
          <a-input v-model="searchData.username" placeholder="用户名" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <a-button type="primary" style="margin-left:10px;" @click="add">新增</a-button>
          <a-upload name="file" :multiple="true" :action="action" :headers="headers" :file-list="[]" style="margin-left: 10px;" @change="handleChange">
            <a-button>
              <a-icon type="upload" /> 上传
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="status" slot-scope="text, row">
          {{ row.status == '' ? '未使用': row.status }}
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="新增" width="500px" ok-text="确认" cancel-text="取消" @ok="handleAdd">
        <a-form ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="用户名">
            <a-input v-model="form.username" />
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-model="form.password" />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal v-model="modifyDialogVisible" title="修改" width="500px" ok-text="确认" cancel-text="取消" @ok="handleEdit">
        <a-form ref="form" :model="modifyForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="名称">
            <a-input v-model="modifyForm.username" />
          </a-form-item>
        </a-form>
      </a-modal>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [{
  title: '用户名',
  dataIndex: 'username',
  width: '100',
  align: 'center'
}, {
  title: '密码',
  dataIndex: 'password',
  width: '100',
  align: 'center'
}, {
  title: '状态',
  dataIndex: 'status',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'status' }
}, {
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
}]
import * as api from '@/api/index'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        username: '',
        page: 1,
        order_created_at: true
      },
      headers: {
        Authorization: ('Bearer ' + window.sessionStorage.getItem('token'))
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      action: process.env.VUE_APP_UPLOAD_ACCOUNT_ADDRESS,
      modifyDialogVisible: false,
      form: {
        username: '',
        password: ''
      },
      modifyForm: {}
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      this.searchData.belong = this.userInfo.data.i
      const res = await api.getAccountInfo(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    add() {
      this.dialogVisible = true
    },
    handleChange(file) {
      if (file.file.status === 'done') {
        this.$message.success(`${file.file.name} 上传成功`)
      } else if (file.file.status === 'error') {
        this.$message.error(`${file.file.name} 上传失败.`)
      }
    },
    async handleAdd() {
      const res = await api.postAccountInfo(this.form)
      if (res.code === 0) {
        this.dialogVisible = false
        this.getTableData()
      }
    },
    edit(row) {
      this.modifyDialogVisible = true
      this.modifyForm = row
    },
    async handleEdit() {
      const res = await api.putUserInter(this.modifyForm)
      if (res.code === 0) {
        this.modifyDialogVisible = false
      }
    },
    async handleDelete(row) {
      const res = await api.delUserInter(row)
      if (res.code === 0) {
        this.getTableData()
      }
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
</style>
