<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="名字">
          <a-input v-model="searchData.campaign_name" placeholder="名字" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :loading="tableLoading" :data-source="tableData" :row-key="record => record.offer_id" class="tableLimit" :bordered="true" :pagination="false">
        <span slot="action" slot-scope="text, row">
          <a-button @click="edit(row)">详情</a-button>
        </span>
      </a-table>

      <a-modal v-model="modifyDialogVisible" :title="modifyForm.offer_name" width="60%" ok-text="申请" cancel-text="取消" @ok="handleEdit">
        <browseDetail :detail="modifyForm" />
      </a-modal>
      <a-modal v-model="dialogEdit" title="选择" width="500px" ok-text="确认" cancel-text="取消" @ok="handleAdd">
        <a-form-model ref="edit_form" layout="horizontal" :model="editForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="选择类型">
            <a-select v-model="editForm.media_type_id" placeholder="请选择类型">
              <a-select-option v-for="(item, index) in modifyForm.allowed_media_types" :key="index" :value="item.allowed_media_type_id">{{item.allowed_media_type_name}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="记录">
            <a-input v-model="editForm.notes" type="textarea" />
          </a-form-model-item>
        </a-form-model>
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
  title: 'offer_id',
  dataIndex: 'offer_id',
  width: '100',
  align: 'center'
}, {
  title: 'offer_name',
  dataIndex: 'offer_name',
  width: '100',
  align: 'center'
}, {
  title: 'payout',
  dataIndex: 'payout',
  width: '100',
  align: 'center'
}, {
  title: 'offer_status',
  dataIndex: 'offer_status',
  width: '100',
  align: 'center',
  customRender: (value, row, index) => {
    return value.status_name
  }
}, {
  title: 'campaign_id',
  dataIndex: 'campaign_id',
  width: '100',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
import * as api from '@/api/index'
import browseDetail from './components/browseDetail'
export default {
  components: {
    browseDetail
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        campaign_name: '',
        // 'vertical_id[]': 'Ecommerce',
        // offer_status_id: 'All',
        // allowed_countries: 'us',
        // 'platform[]': 'All',
        // 'flow[]': 'All',
        // demo: 'All',
        // age: -45770207,
        // tracking_type: 'All',
        // connection_type: 'All',
        // incentivized: 'Both',
        // adult: 'Both',
        // media_types_allowed: 'All',
        // loyalty: 'All',
        start_at_row: 0,
        row_limit: 10
      },
      columns: columns,
      tableData: [],
      total: 0,
      page: 1,
      size: 10,
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {},
      tableLoading: true,
      dialogEdit: false,
      modifyForm: {},
      editForm: {
        media_type_id: '',
        notes: ''
      }
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.searchData.start_at_row = 0
      this.getTableData()
    },
    async getTableData() {
      this.tableLoading = true
      const res = await api.getOfferFeed(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.offers
        this.total = Number(res.data.row_count)
        this.tableLoading = false
      }
    },
    handleCurrentChange(page, size) {
      this.page = page
      this.searchData.start_at_row = (page - 1) * size + 1
      this.getTableData()
    },
    add() {
      this.dialogVisible = true
    },

    edit(row) {
      this.modifyDialogVisible = true
      this.modifyForm = row
    },
    async handleEdit() {
      this.dialogEdit = true
      this.editForm = {
        media_type_id: '',
        notes: ''
      }
    },
    async handleAdd() {
      if (this.editForm.media_type_id === '') {
        this.$message.error('请先选择类型')
        return
      }
      const params = {
        offer_id: this.modifyForm.offer_id,
        offer_contract_id: this.modifyForm.offer_contract_id,
        agreed_to_trems: true,
        media_type_id: this.editForm.media_type_id,
        notes: this.editForm.notes
      }
      const res = await api.ApplyForOffer(params)
      if (res.code === 0 && res.data && res.data.success) {
        this.$message.success('申请成功')
        this.dialogEdit = false
        this.modifyDialogVisible = false
        this.getTableData()
      } else if (!res.data.success) {
        this.$message.error(res.data.message)
      } else {
        this.$message.error('申请失败')
      }
    },
    handleSizeChange(p, s) {
      this.searchData.row_limit = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
</style>
