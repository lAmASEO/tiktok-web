<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="描述">
          <a-input v-model="searchData.describe" placeholder="请输入描述" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <a-button type="primary" style="margin-left:10px;" @click="goodsUpload()">商品上传</a-button>
          <!-- <a-button type="primary" style="margin-left:10px;" @click="SellingAccount">账号出售</a-button> -->
          <!-- <a-button type="primary" style="margin-left:10px;" @click="divisionAccoun">划分至用户</a-button> -->
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
            <!-- <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :row-selection="{ selectedRowKeys: selectPortDataId, onChange: rowSelectionPort }" class="tableLimit" :bordered="true" :pagination="false"> -->
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="avatar" slot-scope="text, row ">
          <a-avatar :src="row.avatar" />
          <p>{{ row.nickname }}</p>
        </span>
        <span slot="is_official" slot-scope="text, row">
          {{ row.is_official === false ?'否':'是'}}
        </span>
        <span slot="price" slot-scope="text, row">
          {{ row.price}} 积分
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" type="primary" @click="goodsUpload(row)">修改</a-button>
          <!-- <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="deletefn(row)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm> -->
        </span>
        
      </a-table>

      <!-- 商品上传 -->
      <a-modal v-model="goodsVisible" title="商品上传" width="400px" ok-text="确认" cancel-text="取消" @ok="goodsSubmit">
        <a-form ref="form" :model="goodsForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <!-- <a-form-item label="唯一ID">
            <a-input v-model="goodsForm.user_id" />
          </a-form-item> -->
          <!-- <a-form-item label="是否自营账号">
            <a-input v-model="goodsForm.is_official" />
          </a-form-item> -->
          <a-form-item label="标题信息" prop="title">
            <a-input v-model="goodsForm.title" />
          </a-form-item>
          <a-form-item label="商品描述">
            <a-input v-model="goodsForm.describe" prop="describe"/>
          </a-form-item>
          <a-form-item label="图片地址">
            <a-input v-model="goodsForm.avatar" prop="avatar"/>
          </a-form-item>
          <a-form-item label="商品价格">
            <a-input v-model="goodsForm.price" prop="price"/>
          </a-form-item>
          <a-form-item label="联系信息">
            <a-input v-model="goodsForm.contact" prop="contact"/>
          </a-form-item>
        </a-form>
      </a-modal>
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
      <a-modal v-model="divisionVisible" title="划分账号" width="500px" ok-text="确认" cancel-text="取消">
        <a-form ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="账号ID">
            <a-input v-model="form.userID" />
          </a-form-item>
          <a-form-item label="用户名称">
            <a-input v-model="form.username" />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 运行记录 -->
      <a-modal v-model="integralVisible"   title="运行记录" width="60%" ok-text="确认" cancel-text="取消">
        <a-table :columns="runInfocolumns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false"></a-table>
      </a-modal>
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
  title: '头像',
  dataIndex: 'avatar',
  align: 'center',
  width: '80px',
  scopedSlots: { customRender: 'avatar' }
},
{
  title: '标题',
  dataIndex: 'title',
  width: '200px',
  ellipsis: true,
  align: 'center'
},
{
  title: '描述',
  dataIndex: 'describe',
  width: '200px',
  ellipsis: true,
  align: 'center'
},
{
  title: '联系信息',
  dataIndex: 'contact',
  width: '200px',
  ellipsis: true,
  align: 'center'
},
{
  title: '价格',
  dataIndex: 'price',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'price' }
},
{
  title: '是否自营',
  dataIndex: 'is_official',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'is_official' }
},
{
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  width: '120px',
  scopedSlots: { customRender: 'action' }
}]
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
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        username: '',
        describe: null,
        page: 1,
        order_created_at: true
      },
      columns: [],
      runInfocolumns: [],
      form: {
        username: '',
        password: '',
        quantity: 0,
        userID: null,
        price: null
      },
      goodsForm: {
        user_id: null,
        is_official: false,
        title: null,
        describe: null,
        avatar: null,
        contact: null,
        price: null
      },
      user_id: null,
      modifyForm: {},
      tableData: [],
      total: 0,
      size: 10,
      selectPortDataId: [],
      selectPortData: [],
      goodsVisible: false,
      // 出售账号
      sellVisible: false,
      // 划分账号
      divisionVisible: false,
      // 积分记录
      integralVisible: false
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.user_id = this.userInfo.data.i
      this.page = 1
      this.columns = []
      this.runInfocolumns = []
      columns.forEach(item => {
        this.columns.push(item)
      })
      runInfocolumns.forEach(item => {
        this.runInfocolumns.push(item)
      })
      this.searchData.describe = this.searchData.describe || null
      this.getTableData()
    },
    getTableData() {
      let searchData = {}
      searchData.page = this.page
      searchData.size = this.size
      searchData.user_id = this.user_id
      searchData.describe = this.searchData.describe
      api.getDealerCommodityAccount(searchData).then((res) => {
        this.tableData = res.data.data
        this.total = res.data.count
      })
    },
    // 商品上传
    goodsUpload(row) {
      if(row) {
        this.goodsForm = row
      }
      this.goodsVisible = true
    },
    goodsSubmit() {
      let goodsForm = {}
      goodsForm.id = this.goodsForm.id
      goodsForm.user_id = this.user_id
      goodsForm.title = this.goodsForm.title
      goodsForm.describe = this.goodsForm.describe
      goodsForm.avatar = this.goodsForm.avatar
      goodsForm.contact = this.goodsForm.contact
      goodsForm.price = Number(this.goodsForm.price)
      api.postDealerCommodityAccount(goodsForm).then((res) =>{
        if(res.code === 0) {
          this.goodsVisible = false
          this.init()
        }
      })
    },
    deletefn(row) {
      api.putDealerCommodityAccount(id).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
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
    divisionAccoun() {
      this.divisionVisible = true
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
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
</style>
