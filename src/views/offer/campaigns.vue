<template>
  <div>
    <a-spin size="large" :spinning="spinning">
      <!-- <div class="search-box">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <a-form-item label="名字">
            <a-input v-model="searchData.name" placeholder="名字" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="init()">查询</a-button>
          </a-form-item>
        </a-form>
      </div> -->
      <div class="table-box">
        <a-table :columns="columns" :loading="tableLoading" :data-source="tableData" :row-key="record => record.offer_id" class="tableLimit" :bordered="true" :pagination="false">
          <span slot="action" slot-scope="text, row">
            <a-button @click="view(row)">详情</a-button>
            <a-button type="primary" style="margin-left: 8px" @click="getLink(row)">链接</a-button>
          </span>
        </a-table>

        <a-modal v-model="dialogVisible" title="生成链接" width="600px" ok-text="复制" cancel-text="取消" @ok="handleAdd">
          <campaginsLink ref="campaginsLink" :detail="form" @cancel="dialogVisible = false" />
        </a-modal>
        <a-modal v-model="modifyDialogVisible" title="查看" width="60%" ok-text="确认" cancel-text="取消" @ok="modifyDialogVisible = false">
          <campaignsDetail :detail="modifyForm" />
        </a-modal>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
const columns = [{
  title: 'offer_id',
  dataIndex: 'offer_id',
  width: '100px',
  align: 'center'
}, {
  title: 'campaign_id',
  dataIndex: 'campaign_id',
  width: '130px',
  align: 'center'
}, {
  title: 'offer_name',
  dataIndex: 'offer_name',
  width: '400px',
  align: 'center'
}, {
  title: 'payout',
  dataIndex: 'payout',
  width: '100px',
  align: 'center'
}, {
  title: 'vertical_name',
  dataIndex: 'vertical_name',
  width: '150px',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
import * as api from '@/api/index'
import campaignsDetail from './components/campaignsDetail'
import campaginsLink from './components/campaginsLink'
export default {
  components: {
    campaignsDetail,
    campaginsLink
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        // tracking_domain: '',
        // ssl: 'False',
        start_at_row: 0,
        row_limit: 10
      },
      columns: columns,
      tableData: [],
      total: 0,
      page: 1,
      size: 10,
      tableLoading: true,
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {},
      spinning: false,
      modifyForm: {}
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
      const res = await api.GetCampaignsLinks(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.campaign_links
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
    async handleAdd() {
      this.$refs.campaginsLink.copy()
    },
    async view(row) {
      this.spinning = true
      try {
        const res = await api.GetCampaign({
          offer_id: row.offer_id
        })
        if (res.code === 0 && res.data) {
          this.modifyDialogVisible = true
          this.modifyForm = res.data[0]
          this.spinning = false
        }
      } catch (e) {
        this.spinning = false
      }
    },
    getLink(row) {
      this.dialogVisible = true
      this.form = row
      console.log(row)
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
