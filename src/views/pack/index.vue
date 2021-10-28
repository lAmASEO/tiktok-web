<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="包名">
          <a-input v-model="searchData.name" placeholder="包名" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <!-- <a-button type="primary" style="margin-left: 10px;" @click="check">切换账号</a-button> -->
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :row-selection="rowSelection" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button @click="view(row.id)">查看</a-button>
        </span>
      </a-table>

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
import * as api from '@/api/index'
const columns = [{
  title: '包名',
  dataIndex: 'name',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      searchData: {
        device_id: null,
        name: '',
        page: 1,
        order_created_at: true
      },
      columns: [],
      tableData: [],
      total: 0,
      size: 10,
      form: {
      },
      pack_list: [],
      modifyForm: {}
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.pack_list = []
          selectedRowKeys.forEach(item => {
            this.pack_list.push(item)
          })
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
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
      if (this.$route.query?.device_id) {
        this.searchData.device_id = this.$route.query.device_id
      }
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getPack(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    view(id) {
      this.$router.push({
        name: 'AccountManage',
        query: {
          bundle_id: id
        }
      })
    },
    async check() {
      if (this.pack_list.length === 0) {
        this.$message.error('请先勾选')
        return
      }
      this.pack_list.forEach(async item => {
        await api.postTask({
          type: 8,
          switch_account: '',
          executive_bundle: item,
          isMessage: false
        })
      })
      this.$message.success('提交成功')
    },
    handleSelectionChange(row) {
      this.pack_list = []
      row.forEach(item => {
        this.pack_list.push(item.id)
      })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>
