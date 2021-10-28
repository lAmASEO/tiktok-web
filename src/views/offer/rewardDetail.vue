<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="来源用户名">
          <a-input v-model="searchData._like_r_source_user_name" placeholder="来源用户名" style="width:150px" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="searchData.status" placeholder="状态" style="width: 150px" allow-clear @change="getTableData">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="0">等待确认</a-select-option>
            <a-select-option value="1">已确认</a-select-option>
            <a-select-option value="2">已完成</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间">
          <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="small" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <a-button v-if="(role == 1 && searchData.status ===' 0' && searchData.user_id == userId) || (role == 2 && searchData.status === '0')" type="primary" style="margin-left: 10px;" @click="batchConfirm">批量确认</a-button>
          <a-button v-if="role == 1 && searchData.status == 1" type="primary" style="margin-left: 10px;" @click="batchComplete">批量完成</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="income">
      <span v-if="(searchData.status == '' || searchData.status == null) && role != 1">总收入:{{ income.total / 100 }}</span>
      <span v-if="searchData.status === '0' && role != 1">等待确认总收入:{{ income.unconfirmed / 100 }}</span>
      <span v-if="searchData.status == 1 && role != 1">已确认总收入:{{ income.confirmed / 100 }}</span>
      <span v-if="searchData.status == 2 && role != 1">完成总收入:{{ income.complete / 100 }}</span>
      <span style="margin-left: 20px;">已选收入: {{ count.toFixed(2) }}</span>
      <span v-if="timeCount != null" style="margin-left: 30px;">
        {{ timeStr }} 总金额: {{ timeCount }}
      </span>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :scroll="{ x: 1500}" :row-selection="{selectedRowKeys: selectData ,onChange: rowSelection}" class="tableLimit" :bordered="true" :pagination="false">
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
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200', '500']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
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
  width: '120px',
  role: [1],
  align: 'center'
}, {
  title: '收益类型',
  dataIndex: 'type',
  width: '130px',
  align: 'center',
  customRender: (value) => {
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
  customRender: (value) => {
    return value / 100 + '%'
  }
}, {
  title: '收入',
  dataIndex: 'price',
  width: '70px',
  align: 'center',
  customRender: (value) => {
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
  width: '170px',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
}, {
  title: '确认时间',
  dataIndex: 'confirm',
  width: '170px',
  align: 'center',
  scopedSlots: { customRender: 'confirm' }
}, {
  title: '完成时间',
  dataIndex: 'complete',
  width: '170px',
  align: 'center',
  scopedSlots: { customRender: 'complete' }
}]
import * as api from '@/api/index'
import { parseTime } from '@/utils/index'
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
        _like_r_source_user_name: '',
        status: '',
        page: 1,
        order_created_at: true
      },
      columns: [],
      count: 0,
      tableData: [],
      total: 0,
      size: 10,
      userId: 0,
      income: {},
      timeCount: null,
      timeStr: '',
      selectData: [],
      time: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectData.length > 0
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.userId = this.userInfo.data.i
    const res = await api.getIncome()
    if (res.code === 0) {
      this.income = res.data.reward
    }
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
      this.searchData.after_created_at = null
      this.searchData.before_created_at = null
      if (this.time != null && this.time !== '') {
        this.searchData.after_created_at = Math.floor(this.time[0].getTime() / 1000)
        this.searchData.before_created_at = Math.floor(this.time[1].getTime() / 1000)
        const user_id = this.$route.query.user_id || this.userId
        const countRes = await api.getRewardTimeCount({
          after_created_at: this.searchData.after_created_at,
          before_created_at: this.searchData.before_created_at,
          user_id
        })
        this.timeCount = countRes.data.counts / 100
        this.timeStr = parseTime(this.time[0]) + ' 至 ' + parseTime(this.time[1])
      }
      this.selectData = []
      this.count = 0
      if (this.role !== 1) {
        this.searchData.user_id = this.userId
        this.searchData._is_price_not_zero_price = true
      }
      if (this.$route.query.user_id) {
        this.searchData.user_id = this.$route.query.user_id
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
    rowSelection(selectedRowKeys, data) {
      this.selectData = []
      this.count = 0
      console.log(selectedRowKeys)
      selectedRowKeys.forEach(item => {
        this.selectData.push(item)
      })
      data.forEach(item => {
        console.log(item.price)
        this.count += (item.price / 100)
      })
    },
    async batchConfirm() {
      let user_id = 0
      if (this.$route.query.user_id) {
        user_id = this.$route.query.user_id
      } else {
        user_id = this.userId
      }
      const res = await api.putRewardConfirm({
        list: this.selectData,
        user_id: Number(user_id)
      })
      if (res.code === 0) {
        this.getTableData()
      }
    },
    async batchComplete() {
      let user_id = 0
      if (this.$route.query.user_id) {
        user_id = this.$route.query.user_id
      } else {
        user_id = this.userId
      }
      const res = await api.putRewardComplete({
        list: this.selectData,
        user_id: Number(user_id)
      })
      if (res.code === 0) {
        this.getTableData()
      }
    }
  }
}
</script>

<style lang="scss">
.income {
  margin-top: 20px;
}
.table-box {
  margin-top: 10px;
}
</style>
