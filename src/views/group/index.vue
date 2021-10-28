<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="组名">
          <a-input v-model="searchData.name" placeholder="组名" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <a-button style="margin-left:10px;" type="primary" @click="add">新增</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" @click="view(row)">查看账号</a-button>
          <a-button style="margin-left:10px" type="primary" @click="edit(row)">编辑</a-button>
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="handleDelete(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm>

        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="新增" width="500px" ok-text="确认" cancel-text="取消" @ok="handleAdd">
        <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="名称">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="modifyDialogVisible" title="修改" width="500px" ok-text="确认" cancel-text="取消" @ok="handleEdit">
        <a-form-model ref="form" :model="modifyForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="名称">
            <a-input v-model="modifyForm.name" />
          </a-form-model-item>
        </a-form-model>

      </a-modal>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :total="total" :current="searchData.page" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'
const columns = [{
  title: '组名',
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
  width: '300',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        name: '',
        page: 1,
        order_created_at: true
      },
      tableData: [],
      columns: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      modifyDialogVisible: false,
      role: null,
      form: {
        name: null
      },
      modifyForm: {
        name: null
      }
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.columns = []
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columns.push(item)
    })
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getGroup(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    view(row) {
      this.$router.push({
        name: 'AccountManage',
        query: { group_id: row.id }
      })
    },
    add() {
      this.dialogVisible = true
    },
    handleAdd() {
      if (this.form.name === '' || this.form.name === null) {
        this.$message.error('群组名不能为空')
        return
      }
      api.postGroup(this.form).then((res) => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.getTableData()
        }
      })
    },
    edit(row) {
      this.modifyDialogVisible = true
      this.modifyForm = row
    },
    handleEdit() {
      if (this.modifyForm.name === '' || this.modifyForm.name === null) {
        this.$message.error('群组名不能为空')
        return
      }
      api.putGroup(this.modifyForm).then(res => {
        if (res.code === 0) {
          this.modifyDialogVisible = false
        }
      })
    },
    handleDelete(row) {
      api.delGroup(row).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
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
