<template>
  <div>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <el-date-picker v-model="time" size="small" type="daterange" align="left" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" @change="change" />
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'

export default {
  props: {
    start: {
      type: Date,
      // eslint-disable-next-line space-before-function-paren
      default: function () {
        const todayYear = (new Date()).getFullYear()
        const todayMonth = (new Date()).getMonth()
        const todayDay = (new Date()).getDate()
        const start = new Date(todayYear, todayMonth, todayDay, '00', '00', '00')
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return start
      }
    },
    end: {
      type: Date,
      // eslint-disable-next-line space-before-function-paren
      default: function () {
        const todayYear = (new Date()).getFullYear()
        const todayMonth = (new Date()).getMonth()
        const todayDay = (new Date()).getDate()
        const end = new Date(todayYear, todayMonth, todayDay, '23', '59', '59')
        return end
      }
    }
  },
  data() {
    const todayYear = (new Date()).getFullYear()
    const todayMonth = (new Date()).getMonth()
    const todayDay = (new Date()).getDate()
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date(todayYear, todayMonth, todayDay, '23', '59', '59')
            const start = new Date(todayYear, todayMonth, todayDay, '00', '00', '00')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date(todayYear, todayMonth, todayDay, '23', '59', '59')
            const start = new Date(todayYear, todayMonth, todayDay, '00', '00', '00')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date(todayYear, todayMonth, todayDay, '23', '59', '59')
            const start = new Date(todayYear, todayMonth, todayDay, '00', '00', '00')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      time: []
    }
  },
  mounted() {
    this.time = [this.start, this.end]
    const startTime = this.time[0]
    const endTime = this.time[1]
    const result = (this.getdiffdate(parseTime(startTime, '{y}-{m}-{d}'), parseTime(endTime)))
    this.$emit('getTime', 'day', Math.floor(this.time[0].getTime() / 1000), Math.floor(this.time[1].getTime() / 1000), result)
  },
  methods: {
    change(value) {
      if (value == null) {
        return
      }
      const startTime = value[0]
      const endTime = value[1]
      const result = (this.getdiffdate(parseTime(startTime, '{y}-{m}-{d}'), parseTime(endTime)))
      this.$emit('getTime', 'day', Math.floor(value[0].getTime() / 1000), Math.floor(value[1].getTime() / 1000), result)
    },
    getdiffdate(stime, etime) {
      var diffdate = []
      var i = 0
      var result = []
      while (stime <= etime) {
        diffdate[i] = stime
        result[i] = {}
        result[i].date = stime
        var stime_ts = new Date(stime + ' 00:00:00').getTime()
        // console.log('当前日期：' + stime + '当前时间戳：' + stime_ts)
        var next_date = stime_ts + (24 * 60 * 60 * 1000)
        var next_dates_y = new Date(next_date).getFullYear() + '-'
        var next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-'
        var next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate()
        stime = next_dates_y + next_dates_m + next_dates_d
        // result[i].day = next_dates_d
        // result[i].time = next_dates_month + '月' + next_dates_d + '日'
        result[i].startTime = stime_ts
        result[i].endTime = next_date
        i++
      }
      // console.log(diffdate)
      // console.log(result)
      return result
    }
  }
}
</script>

<style lang="scss">
</style>
