<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="昵称">
          <a-input v-model="searchData.nickname" placeholder="请输入昵称" allow-clear />
        </a-form-item>
        <!-- <a-form-item label="ID">
          <a-input v-model="searchData.id" placeholder="请输入ID" allow-clear />
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <!-- <a-button type="primary" style="margin-left:10px;" @click="SellingAccount">账号出售</a-button> -->
          <a-button type="primary" style="margin-left:10px;" @click="divisionAccoun">划分至用户</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :row-selection="{ selectedRowKeys: selectPortDataId, onChange: rowSelectionPort }" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="avatar" slot-scope="text, row ">
          <a-avatar :src="row.avatar" />
          <p>{{ row.nickname }}</p>
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <!-- <span slot="action">
          <a-button style="margin-left: 10px" @click="view(row)">查看账号</a-button>
          <a-button style="margin-left: 10px" @click="divisionAccoun(row)" type="primary">划分账号</a-button>
          <a-button style="margin-left: 10px" @click="integralView(row)">运行记录</a-button>
          <a-button style="margin-left: 10px" type="danger">删除</a-button>
        </span> -->
      </a-table>

      <!-- 账号出售 -->
      <a-modal v-model="sellVisible" title="出售" width="500px" ok-text="确认" cancel-text="取消" @ok="sell">
        <a-form ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="出售人">
            <a-input v-model="form.username" />
          </a-form-item>
          <a-form-item label="价格">
            <a-input v-model="form.price" />
          </a-form-item>
          <a-form-item label="账号">
            <a-input v-model="form.quantity" />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 划分账号 -->
      <a-modal v-model="divisionVisible" title="划分账号" width="500px" ok-text="确认" cancel-text="取消" @ok="divisionAccounSubmit">
        <a-form ref="form" :model="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
          <!-- <a-form-item label="账号ID">
            <a-input v-model="form.userID" readOnly/>
          </a-form-item> -->
          <a-form-item label="用户">
            <a-input v-model="form.username"  @click="divisionView" readOnly/>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 用户信息 -->
      <a-modal v-model="informationVisible" title="用户信息" width="400px" ok-text="确认" cancel-text="取消" @ok="informationSubmit">
        <a-table :columns="columnsSelect" :row-key="record => record.id" :data-source="tableSelectData" :row-selection="{ selectedRowKeys: selectDataId, onChange: rowSelection }" :bordered="true" :pagination="false">
        <span slot="status" slot-scope="text, row">
          {{ row.status == 0 ? '正常' : '封禁' }}
        </span>
        </a-table>
    </a-modal>
      <!-- 运行记录 -->
      <a-modal v-model="integralVisible"   title="运行记录" width="60%" ok-text="确认" cancel-text="取消">
        <a-table :columns="runInfocolumns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false"></a-table>
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
  title: '头像',
  dataIndex: 'avatar',
  align: 'center',
  width: '80px',
  scopedSlots: { customRender: 'avatar' }
},
/* {
  title: 'ID',
  dataIndex: 'id',
  width: '100px',
  ellipsis: true,
  align: 'center',
}, */
{
  title: '个签',
  dataIndex: 'signature',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '帖子数量',
  dataIndex: 'posts_number',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '关注人数',
  dataIndex: 'follow_number',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '好友数量',
  dataIndex: 'friends_number',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
/* {
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  width: '120px',
  scopedSlots: { customRender: 'action' }
} */
]
const columnsSelect = [{
    title: '用户名',
    dataIndex: 'username',
    width: '100px',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'status' }
  },
 /*  {
    title: '流量(M)',
    dataIndex: 'flow',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'flow' }
  } */
  ]
const runInfocolumns = [{

    title: '任务类型',
    dataIndex: 'type',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '昵称',
    dataIndex: 'nickname',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '目标用户',
    dataIndex: 'unique_id',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '地区',
    dataIndex: 'region',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '状态',
    dataIndex: 'status',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '创建时间',
    dataIndex: 'created_at',
    width: '60px',
    ellipsis: true,
    align: 'center'
}]
import * as api from '@/api/index'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        nickname: '',
        page: 1,
        size: 10,
        id: null,
        order_created_at: true
      },
      columns: [],
      page: 1,
      runInfocolumns: [],
      columnsSelect: [],
      selectDataId: [],
      selectData: [],
      form: {
        username: '',
        password: '',
        quantity: 0,
        userID: null,
        userUserID: null,
        price: null
      },
      user_id: null,
      modifyForm: {},
      tableData: [],
      total: 0,
      size: 10,
      tableSelectData: [],
      selectPortDataId: [],
      selectPortData: [],
      // 出售账号
      sellVisible: false,
      // 划分账号
      divisionVisible: false,
      // 积分记录
      integralVisible: false,
      informationVisible: false
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.user_id = this.$route.query.device_id || null
      this.searchData.nickname = this.searchData.nickname || null 
      this.searchData.id = this.searchData.id || null
      this.page = 1
      this.searchData.page = 1
      this.columns = []
      this.selectDataId = []
      this.selectData = []
      this.selectPortDataId = []
      this.selectPortData = []
      this.columnsSelect = []
      this.runInfocolumns = []
      columns.forEach(item => {
        this.columns.push(item)
      })
      runInfocolumns.forEach(item => {
        this.runInfocolumns.push(item)
      })
      columnsSelect.forEach(item => {
        this.columnsSelect.push(item)
      })
      this.getTableData()
    },
    getTableData() {
      let searchData = {}
      searchData.page = this.searchData.page
      searchData.page_size = this.searchData.size
      searchData.user_id = this.user_id
      searchData.id = this.searchData.id
      searchData.nickname = this.searchData.nickname
      searchData.order_created_at = this.searchData.order_created_at

      api.getDealerAcount (searchData).then((res) => {
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
    divisionView() {
      this.informationVisible = true
    },
    getSelectTableData() {
      let searchData = {}
      searchData.page = this.page
      searchData.size = this.size
      api.getDealerUser(searchData).then((res) => {
        this.tableSelectData = res.data.data
        this.total = res.data.count
      })
    },
    informationSubmit() {
      if(this.selectDataId.length != 1) {
        this.$message.error('请选择一个账号')
        return
      }
      this.informationVisible = false
      this.form.username = this.selectData[0].username
      this.form.userUserID = this.selectDataId[0]
    },

    // 划分账号
    divisionAccoun() {
      if(this.selectPortDataId.length === 0) {
        this.$message.error('请先选择要分配的账号')
        return
      }
      this.divisionVisible = true
      this.form.userID = this.selectPortDataId
      this.getSelectTableData()
    },
    divisionAccounSubmit() {
      let form = {}
      form.list = this.form.userID
      form.user_id = this.form.userUserID
      api.postDealeryAccountAssign(form).then((res) => {
        if(res.code === 0) {
          this.divisionVisible = false
          this.init()
        }
      }).catch((err) => {
        Message({
          message: err.msg,
          type: 'error'
        })
      })
    },
    // 选择用户
    rowSelection(selectedRowKeys, values) {
      this.selectDataId = []
      this.selectData = []
      selectedRowKeys.forEach(item => {
        this.selectDataId.push(item)
      })
      values.forEach(item => {
        this.selectData.push(item)
      })
    },

    // 查看账号
    view(row) {
      this.$router.push({
        name: 'account',
        query: {
          device_id: row.id
        }
      })
    },
    // 查看积分
    integralView() {
      this.integralVisible = true
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
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.size = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
</style>
