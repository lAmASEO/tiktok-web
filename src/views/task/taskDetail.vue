<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">任务管理</el-breadcrumb-item>
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <!-- <span slot="success" slot-scope="text, row">
          {{ row.success ? '成功' : '失败' }}
        </span> -->
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
  title: '日志时间',
  dataIndex: 'created_at',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
}, {
  title: '任务ID',
  dataIndex: 'task_id',
  align: 'center'
}, {
  title: '目标账号',
  dataIndex: 'nickname',
  align: 'center'
}, {
  title: '目标用户',
  dataIndex: 'unique_id',
  align: 'center'
}, {
  title: '是否成功',
  dataIndex: 'status',
  align: 'center'
}]
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        page: 1,
        order_created_at: true,
        task_id: ''
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {},
      modifyForm: {}
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.searchData.task_id = this.$route.query.id
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getAccountRecordUser(this.searchData)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box {
  margin-top: 30px;
}
</style>
