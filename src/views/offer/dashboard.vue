<template>
  <div class="dashboard-editor-container">
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="时间">
          <!-- <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="small" /> -->
          <!-- <el-date-picker v-model="time" align="right" type="date" placeholder="选择日期"  size="small" :picker-options="pickerOptions" /> -->
          <get-time @getTime="getData" />
        </a-form-item>
      </a-form>
    </div>
    <a-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </a-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import getTime from './components/getTime'
import * as api from '@/api/index'

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    getTime
  },
  data() {
    return {
      searchData: {
        page_size: 0,
        userId: null,
        after_created_at: null,
        before_created_at: null,
        page: 1
      },
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      userId: 0,
      lineChartData: {},
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
  async mounted() {
    this.searchData.userId = this.userInfo.data.i
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.getTableData()
    },
    async getData(type, after_created_at, before_created_at, result) {
      if (type === 'day') {
        this.searchData.after_created_at = after_created_at
        this.searchData.before_created_at = before_created_at
        const res = await api.getAdRecord(this.searchData)
        if (res.code === 0) {
          this.searchData.page_size = res.data.count
        }
        await this.getTableData()
        this.lineChartData = {}
        this.lineChartData.x = []
        this.lineChartData.y = []
        // 当选择为一天时
        if (result.length === 1) {
          const value = result[0]
          for (let i = 0; i < 24; i++) {
            this.lineChartData.x.push(i)
            this.lineChartData.y.push(this.tableData.filter(data => data.timetemp >= value.startTime + (i * 3600000) && data.timetemp < value.startTime + ((i + 1) * 3600000)))
          }
        } else {
          // 选择一天以上
          result.forEach(item => {
            this.lineChartData.x.push(item.date)
            this.lineChartData.y.push(this.tableData.filter(data => data.timetemp >= item.startTime && data.timetemp < item.endTime))
          })
        }
        console.log(this.lineChartData)
      }
    },
    async getTableData() {
      const res = await api.getAdRecord(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
        this.tableData.forEach(item => {
          if (item.created_at != null) {
            item.timetemp = (new Date(item.created_at)).getTime()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .search-box {
    margin-bottom: 20px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
