<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="名字">
          <a-input v-model="searchData.name" placeholder="名字" style="width: 120px" allow-clear />
        </a-form-item>
        <a-form-item label="sub4">
          <a-input v-model="searchData.subid_4" placeholder="sub4" style="width: 120px" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="searchData.status" placeholder="状态" style="width: 120px" allow-clear @change="getTableData">
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
          <a-button v-if="(role == 1 && searchData.status === '0' && searchData.user_id == userId) || (role == 2 && searchData.status === '0')" type="primary" style="margin-left: 10px;" @click="batchConfirm">批量确认</a-button>
          <a-button v-if="role == 1 && searchData.status == 1" type="primary" style="margin-left: 10px;" @click="batchComplete">批量完成</a-button>
          <!-- <span style="margin-left: 20px;">已选总收入: {{ count }}</span> -->
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
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :row-selection="{selectedRowKeys: selectData ,onChange: rowSelection}" class="tableLimit" :bordered="true" :scroll="{ x: 2500}" :pagination="false">
        <span slot="confirm" slot-scope="text, row">
          {{ row.confirm == null ? null : new Date(row.confirm) | getTime }}
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
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
  title: '用户',
  dataIndex: 'subid_5',
  width: '120px',
  align: 'center',
  role: [1]
}, {
  title: '总金额',
  dataIndex: 'total_price',
  width: '100',
  align: 'center',
  role: [1],
  customRender: (value, row, index) => {
    return value / 100
  }
}, {
  title: '收入',
  dataIndex: 'income_price',
  width: '100',
  align: 'center',
  customRender: (value, row, index) => {
    return value / 100
  }
}, {
  title: '状态',
  dataIndex: 'status',
  width: '90px',
  align: 'center',
  scopedSlots: { customRender: 'status' }
},
{
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
}, {
  title: '转换ID',
  dataIndex: 'unique',
  width: '100',
  align: 'center'
}, {
  title: '交易ID',
  dataIndex: 'transaction_id',
  ellipsis: true,
  width: '100',
  align: 'center'
}, {
  title: '事件名',
  dataIndex: 'event_name',
  ellipsis: true,
  width: '100',
  align: 'center'
}, {
  title: 's4',
  dataIndex: 'subid_4',
  width: '100',
  align: 'center'
}, {
  title: 's3',
  dataIndex: 'subid_3',
  width: '120px',
  align: 'center'
}, {
  title: 's2',
  dataIndex: 'subid_2',
  width: '120px',
  align: 'center'
}, {
  title: 's1',
  dataIndex: 'subid_1',
  width: '120px',
  align: 'center'
}, {
  title: '点击IP',
  dataIndex: 'click_ip',
  width: '150px',
  ellipsis: true,
  align: 'center'
}, {
  title: '国家',
  dataIndex: 'country',
  width: '100',
  align: 'center'
}, {
  title: '设备名',
  dataIndex: 'device',
  width: '120px',
  ellipsis: true,
  align: 'center'
}, {
  title: '设备类型',
  dataIndex: 'device_type',
  width: '120px',
  align: 'center'
}, {
  title: '系统',
  dataIndex: 'os',
  width: '100',
  align: 'center'
}, {
  title: '浏览器',
  dataIndex: 'browser',
  ellipsis: true,
  width: '100',
  align: 'center'
}, {
  title: 'ISP',
  dataIndex: 'isp_carrier',
  ellipsis: true,
  width: '100',
  align: 'center'
}, {
  title: 'ref',
  dataIndex: 'referrer',
  ellipsis: true,
  width: '100',
  align: 'center'
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
      userId: 0,
      searchData: {
        status: '',
        subid_4: '',
        page: 1,
        order_created_at: true
      },
      columns: [],
      tableData: [],
      total: 0,
      size: 10,
      count: 0,
      income: {},
      timeCount: null,
      timeStr: '',
      time: '',
      selectData: [],
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
      this.income = res.data.adRecord
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
      this.timeCount = null
      this.searchData.after_created_at = null
      this.searchData.before_created_at = null
      if (this.time != null && this.time !== '') {
        this.searchData.after_created_at = Math.floor(this.time[0].getTime() / 1000)
        this.searchData.before_created_at = Math.floor(this.time[1].getTime() / 1000)
        const user_id = this.$route.query.user_id || this.userId
        const countRes = await api.getTimeCount({
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
        this.searchData._is_price_not_zero_income_price = true
      }
      if (this.$route.query.user_id) {
        this.searchData.user_id = this.$route.query.user_id
      }
      const res = await api.getAdRecord(this.searchData)
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
      selectedRowKeys.forEach(item => {
        this.selectData.push(item)
      })
      data.forEach(item => {
        console.log(item.income_price)
        this.count += (item.income_price / 100)
      })
      console.log(this.count)
    },
    async batchConfirm() {
      let user_id = 0
      if (this.$route.query.user_id) {
        user_id = this.$route.query.user_id
      } else {
        user_id = this.userId
      }
      const res = await api.putAdRecordConfirm({
        list: this.selectData,
        user_id: Number(user_id)
      })
      if (res.code === 0) {
        this.getTableData()
      }
    },
    async batchComplete() {
      const user_id = this.$route.query.user_id || this.userId
      const res = await api.putAdRecordComplete({
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
