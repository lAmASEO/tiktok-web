<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="资源类型">
          <a-select v-model="searchData.type" placeholder="选择私信类型" style="width:150px" @change="getTableData">
            <a-select-option :value="1">代理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <a-button type="primary" style="margin-left:10px;" @click="add">新增</a-button>
          <a-button type="primary" style="margin-left:10px;">购买</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <!-- <a-button style="margin-left: 8px" type="primary" @click="view(row)">预览</a-button> -->
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="handleDelete(row.id)">
            <a-button style="margin-left: 8px" type="danger">删除</a-button>
          </a-popconfirm>
          <a-button style="margin-left: 8px" type="primary">绑定账号</a-button>
        </span>
      </a-table>


      <a-modal v-model="dialogVisible" title="新增代理" width="500px" ok-text="确认" cancel-text="取消" @ok="handleAdd">
        <a-form ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="资源名称">
            <a-input v-model="form.name" />
          </a-form-item>
          <a-form-item label="资源内容">
            <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
              <a-button>
                <a-icon type="upload" /> 上传
              </a-button>
            </a-upload>
          </a-form-item>
        </a-form>
      </a-modal>



      <a-modal v-model="dialogView" title="预览" width="500px" ok-text="确认" cancel-text="取消" @ok="handleEdit">
        <p v-for="(item, index) in dataInfo" :key="index">{{ item }}</p>
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
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
}, {
  title: 'IP',
  dataIndex: 'url',
  width: '100',
  align: 'center'
}, {
  title: '使用次数',
  dataIndex: 'use_num',
  width: '100',
  align: 'center'
},
// 待确定 dataIndex
{
  title: '名称/备注',
  dataIndex: 'use_num',
  width: '100',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
import * as api from '@/api/index'
import axios from 'axios'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      type: 1,
      searchData: {
        name: '',
        type: 1,
        page: 1,
        order_created_at: true
      },
      fileList: [],
      headers: {
        Authorization: ('Bearer ' + window.sessionStorage.getItem('token'))
      },
      resourceType: [{ label: '文本', value: 1 }, { label: '富文本', value: 2 }, { label: '视频', value: 3 }, { label: '图片', value: 5 }, { label: '名片', value: 6 }],
      action: process.env.VUE_APP_UPLOAD_PROXY_ADDRESS,
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      user_id: 0,
      dialogVisible: false,
      dialogView: false,
      dataInfo: [],
      modifyDialogVisible: false,
      form: {
        name: '',
        text: [{ value: '' }]
      },
      modifyForm: {}
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.user_id = this.userInfo.data.i
    this.init()
  },
  methods: {
    async init() {
      
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getProxyResource(this.searchData)
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
    async handleAdd() {
      const { fileList } = this
      if (fileList.length === 0) {
        this.$message.error('请先上传资源')
        return
      }
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
        formData.append('name', this.form.name)
        formData.append('user_id', this.user_id)
        formData.append('type', this.type)
      })
      this.uploading = true
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.action, formData, config).then(res => {
        if (res.data.code === 0) {
          this.fileList = []
          this.uploading = false
          this.$message.success('上传成功')
          this.dialogVisible = false
          this.getTableData()
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
    async handleDelete(id) {
      console.log(id)
      const res = await api.delProxyResource(id)
      if (res.code === 0) {
        this.getTableData()
      }
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    handleChange(file) {
      if (file.file.status === 'done') {
        this.$message.success(`${file.file.name} 上传成功`)
      } else if (file.file.status === 'error') {
        this.$message.error(`${file.file.name} 上传失败.`)
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      // this.fileList = [...this.fileList, file]
      this.fileList = [file]
      return false
    },
    view(data) {
      this.dialogView = true
      this.dataInfo = data.data
    }
  }
}
</script>

<style lang="scss">
</style>
