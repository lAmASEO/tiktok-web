<template>
  <div class="tiktok-user">
    <!-- <tag @getTagId="getTagId" /> -->
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="地区">
          <a-input v-model="searchData.region" style="width:150px" placeholder="地区" allow-clear @blur="handleConvert" />
        </a-form-item>
        <!-- <a-form-item label="语言">
          <a-input v-model="searchData.language" style="width:150px" placeholder="语言" allow-clear />
        </a-form-item> -->
        <a-form-item label="昵称">
          <a-input v-model="searchData.nickname" style="width:150px" placeholder="昵称" allow-clear />
        </a-form-item>
        <a-form-item v-if="role == 1" label="uid">
          <a-input v-model="searchData.uid" style="width:150px" placeholder="uid" allow-clear />
        </a-form-item>
        <div v-if="role == 1" style="margin-top: 10px"></div>
        <a-form-item label="用户名">
          <a-input v-model="searchData.unique_id" style="width:150px" placeholder="用户名" allow-clear />
        </a-form-item>
        <a-form-item v-if="role == 1" label="secID">
          <a-input v-model="searchData.sec_uid" style="width:150px" placeholder="secID" allow-clear />
        </a-form-item>
        <a-form-item v-if="role == 1" label="排除使用过的账号">
          <a-select v-model="searchData.exclude_user" style="width:150px" placeholder="排除使用过的账号">
            <a-select-option v-for="item in exclude_user_type" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
          <a-button type="primary" style="margin-left:10px" @click="add">关注</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :loading="tableLoading" :scroll="{ y: 680 }" :data-source="tableData" :row-key="record => record.id" :row-selection="rowSelection" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="head_img_url" slot-scope="text, row ">
          <a-avatar :src="row.head_img_url" />
          <p>{{ row.nickname }}</p>
        </span>
        <span slot="is_blogger" slot-scope="text, row ">
          {{ row.is_blogger ? '是' : '否' }}
        </span>
      </a-table>
      <!-- <addForm :dialog-visible="dialogVisible" :tiktok-user="tiktok_user" @closeForm="dialogVisible = false" @success="init" /> -->
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200', '500', '1000']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
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
import addForm from './addForm'
import tag from './tag'
const columns = [{
  title: '头像',
  dataIndex: 'head_img_url',
  align: 'center',
  scopedSlots: { customRender: 'head_img_url' }
},
/* {
  title: '唯一id',
  dataIndex: 'uid',
  align: 'center'
}, */
{
  title: '用户名',
  dataIndex: 'unique_id',
  align: 'center'
},
{
  title: '地区',
  dataIndex: 'region',
  align: 'center'
},
/* {
  title: 'uid',
  dataIndex: 'sec uid',
  align: 'center'
}, */
{
  title: '帖子数量',
  dataIndex: 'posts_numbe',
  align: 'center'
},
{
  title: '关注人数',
  dataIndex: 'follow_number',
  align: 'center'
},
{
  title: '好友数量',
  dataIndex: 'friends_number',
  align: 'center'
},
{
  title: '个性签名',
  dataIndex: 'signature',
  align: 'center'
},
{
  title: '主页地址',
  dataIndex: 'share_url',
  align: 'center'
}

/* {
  title: '地区',
  dataIndex: 'region',
  ellipsis: true,
  align: 'center'
}, {
  title: '语言',
  dataIndex: 'language',
  ellipsis: true,
  align: 'center'
}, {
  title: '粉丝数',
  dataIndex: 'follower_count',
  ellipsis: true,
  align: 'center'
}, {
  title: '收藏数',
  dataIndex: 'favoriting_count',
  ellipsis: true,
  align: 'center'
}, {
  title: '点赞数',
  dataIndex: 'total_favorited',
  ellipsis: true,
  align: 'center'
}, {
  title: '关注人数',
  dataIndex: 'following_count',
  ellipsis: true,
  align: 'center'
}, {
  title: '作品数量',
  dataIndex: 'aweme_count',
  ellipsis: true,
  align: 'center'
}, {
  title: 'uid',
  dataIndex: 'uid',
  ellipsis: true,
  align: 'center',
  role: [1]
}, {
  title: '评分',
  ellipsis: true,
  dataIndex: 'grade',
  align: 'center',
  role: [1]
} */
]
export default {
  components: {
    addForm,
    tag
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      tableLoading: true,
      searchData: {
        order_created_at: true,
        region: '',
        language: '',
        nickname: '',
        uid: '',
        sec_uid: '',
        unique_id: '',
        gender: null,
        page: 1,
        page_size: 10
      },
      sex_type: [{ label: '女', value: 0 }, { label: '男', value: 1 }],
      exclude_user_type: [{ label: '否', value: null }, { label: '是', value: 1 }],
      tableData: [],
      columns: [],
      total: 0,
      size: 10,
      tiktok_user: [],
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {},
      modifyForm: {}
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.tiktok_user = []
          selectedRowKeys.forEach(item => {
            this.tiktok_user.push(item)
          })
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.columns = []
    columns.forEach(item => {
      if (item.role != null) {
        if (!item.role.includes(this.role)) {
          return
        }
      }
      this.columns.push(item)
    })
    // await api.getTiktokUserTag()
    this.init()
  },
  methods: {
    async init() {
      // this.$refs.table.clearSelection()
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      this.searchData.region = this.searchData.region || null
      this.searchData.language = this.searchData.language || null
      this.searchData.nickname = this.searchData.nickname || null
      this.searchData.uid = this.searchData.uid || null
      this.searchData.sec_uid = this.searchData.sec_uid || null
      this.searchData.unique_id = this.searchData.unique_id || null
      this.tableLoading = true
      const res = await api.getTiktokUser(this.searchData)
      if (res && res.code === 0) {
        if(res.data) {
          this.tableData = res.data.data
          this.total = res.data.count
          this.tableLoading = false
        } else if(!res.data) {
          this.tableData = []
          this.total = 0
          this.tableLoading = false
        }
        
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    add() {
      if (this.tiktok_user.length === 0) {
        this.$message.error('先勾选用户')
        return
      }
      this.dialogVisible = true
    },
    handleSelectionChange(row) {
      this.tiktok_user = []
      row.forEach(item => {
        this.tiktok_user.push(item.id)
      })
    },
    getRowKeys(row) {
      return row.id
    },
    getTagId(id) {
      this.searchData.inner_join_tag_id = id
      this.init()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    handleConvert() {
      if (this.searchData.region !== '' && this.searchData.region != null) {
        this.searchData.region = this.searchData.region.toUpperCase()
      }
    }
  }
}
</script>

<style lang="scss">
.tiktok-user {
  .search-box {
    .el-form {
      border: 1px solid #eee;
      box-sizing: border-box;
      padding: 20px 20px 0 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
