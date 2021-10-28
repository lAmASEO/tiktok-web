<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="受益人">
          <a-input v-model="searchData.username" style="width: 150px" placeholder="受益人" allow-clear />
        </a-form-item>
        <a-form-item label="来源用户名">
          <a-input v-model="searchData.source_user_name" style="width: 150px" placeholder="来源用户名" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="searchData.status" placeholder="状态" style="width: 150px" allow-clear>
            <a-select-option value="0">等待确认</a-select-option>
            <a-select-option value="1">已确认</a-select-option>
            <a-select-option value="2">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <span slot="status" slot-scope="text, row">
          {{ row.status| getStatus }}
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="confirm" slot-scope="text, row">
          {{ row.confirm == null ? null : new Date(row.confirm) | getTime }}
        </span>
        <span slot="complete" slot-scope="text, row">
          {{ row.complete == null ? null : new Date(row.complete) | getTime }}
        </span>
        <span slot="status" slot-scope="text, row">
          {{ row.status | getStatus }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button v-if="role == 1" style="margin-left:10px" type="primary" @click="view(row.user_id)">查看个人</a-button>

          <a-button v-if="(role == 1 || role == 2)" :disabled="row.user_id != userId || row.status != 0" style="margin-left:10px" type="primary" @click="confirm(row)">确认</a-button>
          <a-button v-if="role == 1" :disabled="row.status != 1" style="margin-left:10px" type="primary" @click="complete(row)">完成</a-button>
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
const columns = [{
  title: '收益人',
  dataIndex: 'username',
  width: '100px',
  role: [1],
  align: 'center'
}, {
  title: '收益类型',
  dataIndex: 'type',
  width: '100px',
  align: 'center',
  customRender: (value, row, index) => {
    if (value === 0) return '无'
    if (value === 1) return '二级分销'
    if (value === 2) return '三级分销'
  }
}, {
  title: '来源用户名',
  dataIndex: 'source_user_name',
  width: '120px',
  align: 'center'
}, {
  title: '返利比例',
  dataIndex: 'proportion',
  width: '90px',
  align: 'center',
  customRender: (value, row, index) => {
    return value / 100 + '%'
  }
}, {
  title: '收入',
  dataIndex: 'price',
  width: '70px',
  align: 'center',
  customRender: (value, row, index) => {
    return value / 100
  }
}, {
  title: '状态',
  dataIndex: 'status',
  width: '90px',
  scopedSlots: { customRender: 'status' },
  align: 'center'
}, {
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
}, {
  title: '确认时间',
  dataIndex: 'confirm',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'confirm' }
}, {
  title: '完成时间',
  dataIndex: 'complete',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'complete' }
}, {
  title: '操作',
  dataIndex: 'action',
  width: '300px',
  fixed: 'right',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
import * as api from '@/api/index'
export default {
  filters: {
    getStatus(value) {
      if (value === 0) return '等待确认'
      if (value === 1) return '已确认'
      if (value === 2) return '已完成'
    }
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      searchData: {
        source_user_name: '',
        status: null,
        page: 1,
        order_created_at: true
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      userId: 0
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.userId = this.userInfo.data.i
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      if (this.role !== 1) {
        this.searchData.user_id = this.userId
      }
      const res = await api.getReward(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    async confirm(row) {
      const res = await api.putRewardConfirm({
        list: [row.id],
        user_id: row.user_id
      })
      if (res.code === 0) {
        this.getTableData()
      }
    },
    async complete(row) {
      const res = await api.putRewardComplete({
        list: [row.id],
        user_id: row.user_id
      })
      if (res.code === 0) {
        this.getTableData()
      }
    },
    view(id) {
      this.$router.push({
        name: 'RewardDetail',
        query: {
          user_id: id
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
