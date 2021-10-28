<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="用户">
          <a-input v-model="searchData.subid_5" placeholder="用户" style="width: 120px" allow-clear />
        </a-form-item>
        <a-form-item label="sub4">
          <a-input v-model="searchData.subid_4" placeholder="sub4" style="width: 120px" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="searchData.status" placeholder="状态" style="width: 120px" allow-clear>
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
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :scroll="{ x: 2600}" :pagination="false">
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
        <span slot="action" slot-scope="text, row">
          <a-button v-if="role == 1" style="margin-left:10px" type="primary" @click="view(row.user_id)">查看个人</a-button>
          <a-button v-if="role == 1 || role == 2" :disabled="row.user_id != userId || row.status != 0" style="margin-left:10px" type="primary" @click="confirm(row)">确认</a-button>
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
  title: '用户',
  dataIndex: 'subid_5',
  width: '120px',
  align: 'center',
  role: [1]
}, {
  title: '总金额',
  dataIndex: 'total_price',
  width: '80px',
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
  width: '120px',
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
  width: '100',
  ellipsis: true,
  align: 'center'
}, {
  title: '设备类型',
  dataIndex: 'device_type',
  width: '100px',
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
      userId: 0,
      searchData: {
        status: null,
        subid_5: '',
        subid_4: '',
        page: 1,
        order_created_at: true
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10
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
    async confirm(row) {
      const res = await api.putAdRecordConfirm({
        list: [row.id],
        user_id: row.user_id
      })
      if (res.code === 0) {
        this.getTableData()
      }
    },
    async complete(row) {
      const res = await api.putAdRecordComplete({
        list: [row.id],
        user_id: row.user_id
      })
      if (res.code === 0) {
        this.getTableData()
      }
    },
    view(id) {
      this.$router.push({
        name: 'AdrecordDetail',
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
