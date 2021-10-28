<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="标签名">
          <a-input v-model="searchData.name" placeholder="标签名" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <a-button type="primary" style="margin-left:10px;" @click="add(null)">新增</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button icon="plus" @click="add(row.id)">子标签</a-button>
          <a-button style="margin-left: 8px" type="primary" @click="edit(row)">编辑</a-button>
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="handleDelete(row.id)">
            <a-button style="margin-left:8px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="新增" width="500px" ok-text="确认" cancel-text="取消" @ok="handleAdd">
        <a-form-model ref="form" :model="form" :label-col="{ span: 6 }" :rules="form_rule" :wrapper-col="{ span: 18 }">
          <a-form-model-item label="名称" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="modifyDialogVisible" title="修改" width="500px" ok-text="确认" cancel-text="取消" @ok="handleEdit">
        <a-form-model ref="modifyForm" :model="modifyForm" :rules="form_rule" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-model-item label="名称" prop="name">
            <a-input v-model="modifyForm.name" />
          </a-form-model-item>
        </a-form-model>
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
  title: '标签名',
  dataIndex: 'name',
  width: '100',
  align: 'center'
}, {
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
}, {
  title: '操作',
  dataIndex: 'action',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
import * as api from '@/api/index'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        name: '',
        page: 1,
        order_created_at: true
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {
        name: '',
        parent_id: null
      },
      form_rule: {
        name: [
          { required: true, message: '请输入标签名', trigger: 'blur' }
        ]
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
      const res = await api.getTiktokUserTag(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    add(parent_id) {
      this.form.parent_id = parent_id
      this.dialogVisible = true
    },
    async handleAdd() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.form.parent_id = this.form.parent_id === '' ? null : Number(this.form.parent_id)
          const res = await api.postTag(this.form)
          if (res.code === 0) {
            this.dialogVisible = false
            this.form.parent_id = null
            this.getTableData()
          }
        }
      })
    },
    edit(row) {
      this.modifyDialogVisible = true
      this.modifyForm = row
    },
    async handleEdit() {
      this.$refs['modifyForm'].validate(async valid => {
        if (valid) {
          const res = await api.putTag(this.modifyForm)
          if (res.code === 0) {
            console.log('sss')
            this.modifyDialogVisible = false
          }
        }
      })
    },
    async handleDelete(row) {
      const res = await api.delTag(row)
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
