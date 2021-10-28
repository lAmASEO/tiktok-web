<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="用户名">
          <a-input v-model="searchData.username" placeholder="用户名" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <!-- <a-button type="primary" style="margin-left:10px;" @click="SellingAccount">账号出售</a-button> -->
          <a-button style="margin-left: 10px" type="primary" @click="integralView()">积分记录</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :row-selection="{ selectedRowKeys: selectPortDataId, onChange: rowSelectionPort }" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="status" slot-scope="text, row">
          {{ row.status == 0 ? '正常' : '封禁' }}
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left: 10px" type="primary" @click="view(row)">查看账号</a-button>
          <!-- <a-button type="primary" style="margin-left:10px;" @click="divisionAccoun(row)">划分账号</a-button> -->
          <!-- <a-button style="margin-left: 10px" type="danger"  @click="divisionAccoun(row)">删除</a-button> -->
        </span>
      </a-table>

      <!-- 账号出售 -->
      <a-modal v-model="sellVisible" title="出售" width="500px" ok-text="确认" cancel-text="取消" @ok="sell">
        <a-form ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="出售人">
            <a-input v-model="form.username" />
          </a-form-item>
          <a-form-item label="账号数量">
            <a-input v-model="form.quantity" />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 划分账号 -->
      <a-modal v-model="divisionVisible" title="划分账号" width="500px" ok-text="确认" cancel-text="取消">
        <a-form ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="用户名称">
            <a-input v-model="form.username" />
          </a-form-item>
          <a-form-item label="账号ID">
            <a-input v-model="form.userID" @click="addAccount"/>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 选择账号 -->
      <a-modal v-model="accountVisible" title="划分账号" width="500px" ok-text="确认" cancel-text="取消">
        <a-table :columns="account" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        </a-table>
      </a-modal>
      <!-- 积分记录 -->
      <a-modal v-model="integralVisible" title="积分记录" width="800px" ok-text="确认" cancel-text="取消">
        <a-table :columns="integrationColumns" :data-source="tablePointsRecordData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        </a-table>
        <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${dealertotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="dealerpage" :total="dealertotal" @change="handleDealerCurrentChange" @showSizeChange="handleDealerSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      </a-modal>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
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
    title: '用户名',
    dataIndex: 'username',
    width: '100px',
    align: 'center'
  },
/*   {
    title: '密码',
    dataIndex: 'password',
    width: '100px',
    align: 'center'
  }, */
  {
    title: '状态',
    dataIndex: 'status',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '流量(M)',
    dataIndex: 'flow',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'flow' }
  },
    {
    title: '邮箱',
    dataIndex: 'email',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'email' }
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'created_at' }
  }, {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }]
  const Account = [
    {
      title: '账号名称',
      dataIndex: 'username',
      width: '100px',
      align: 'center'
    },
    {
      title: '唯一ID',
      dataIndex: 'unique_id',
      width: '100px',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '100px',
      align: 'center',
      scopedSlots: { customRender: 'status' }
    }
  ]
  const integrationColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: '100px',
      align: 'center',
      scopedSlots: { customRender: 'username' }
    },
    {
      title: '对象用户名',
      dataIndex: 'target_username',
      width: '100px',
      align: 'center',
      scopedSlots: { customRender: 'target_username' }
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      width: '300px',
      align: 'center',
      scopedSlots: { customRender: 'content' }
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: '80px',
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: '100px',
      align: 'center',
      scopedSlots: { customRender: 'remarks' }
    }
  ]
import * as api from '@/api/index'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        username: '',
        order_created_at: true
      },
      columns: columns,
      account: [],
      tablePointsRecordData: [],
      integrationColumns: [],
      form: {
        username: '',
        password: '',
        quantity: 0,
        userID: null,
        price: null
      },
      modifyForm: {},
      tableData: [],
      page: 1,
      total: 0,
      size: 10,
      dealertotal: 0,
      dealerpage: 1,
      dealersize: 10,
      selectPortDataId: [],
      selectPortData: [],
      // 出售账号
      sellVisible: false,
      // 划分账号
      divisionVisible: false,
      accountVisible: false,
      // 积分记录
      integralVisible: false
    }
  },
  async mounted() {
    this.account = []
    this.integrationColumns = []
    Account.forEach(item => {
      this.account.push(item)
    })
    integrationColumns.forEach(item => {
      this.integrationColumns.push(item)
    })
    this.init()
  },
  methods: {
    async init() {
      this.searchData.username = this.searchData.username || null
      this.page = 1
      this.getTableData()
    },
    getTableData() {
      let searchData = {}
      searchData.page = this.page
      searchData.size = this.size
      searchData.order_created_at =  this.searchData.order_created_at
      searchData.username =  this.searchData.username
      api.getDealerUser(searchData).then((res) => {
        this.tableData = res.data.data
        this.total = res.data.count
      })
    },
    // 账号出售
    SellingAccount() {
      if(this.selectPortDataId.length === 0) {
        this.$message.error('请先选择要绑定的账号')
        return
      }
      this.sellVisible = true
      
    },
    async sell() {
      this.sellVisible = false
    },

    // 划分账号
    divisionAccoun(row) {
      this.divisionVisible = true
    },
    // 选择账号
    addAccount() {
      this.accountVisible = true
    },
    // 查看账号
    view(row) {
      this.$router.push({
        name: 'accountControl',
        query: {
          device_id: row.id
        }
      })
    },
    // 删除账号
    divisionAccoun(row) {
      api.deletefnDealerUser(row.id).then((res) => {
        if(res.code === 0 ) {
          this.init()
        }
      })
    },
    // 查看积分
    integralView() {
      let searchData = {}
      searchData.page = this.dealerpage
      searchData.size = this.dealersize
      api.getDealerPointsRecord(searchData).then((res) => {
        if(res.code === 0) {
          this.tablePointsRecordData = res.data.data
          this.dealertotal = res.data.count
          this.integralVisible = true
        }
      })
    },
    rowSelectionPort(selectedRowKeys, values) {
      this.selectPortDataId = []
      this.selectPortData = []
      selectedRowKeys.forEach(item => {
        this.selectPortDataId.push(item)
      })
      values.forEach(item => {
        this.selectPortData.push(item)
      })
    },
    handleCurrentChange(page) {
      this.page = page
      this.getTableData()
    },
    handleDealerCurrentChange(page) {
      this.dealerpage = page
      this.integralView()
    },
    handleSizeChange(p, s) {
      this.size = s
      this.init()
    },
    handleDealerSizeChange(p, s) {
      this.dealersize = s
      this.integralView()
    }
  }
}
</script>

<style lang="scss">
</style>
