<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="类型">
          <el-select v-model="searchData.type">
            <el-option v-for="(item, index) in task_type" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="role == 1" label="创建人所属用户ID">
          <el-input v-model="searchData.belong" placeholder="创建人ID" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="tableData" class="tableLimit" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="100" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="name" label="创建时间" width="140" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ new Date(scope.row.created_at) | getTime }}
          </template>
        </el-table-column>
        <el-table-column v-if="role == 1" prop="belong_name" label="创建人" align="center" :show-overflow-tooltip="true" />
        <el-table-column v-if="searchData.type != 7 && searchData.type != 8" prop="group_name" label="组名" align="center" :show-overflow-tooltip="true" />
        <el-table-column v-if="searchData.type != 7 && searchData.type != 8" prop="executive" label="账号ID" min-width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.executive }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type == 7" prop="account_username" label="账号" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.account_username }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type == 7" prop="account_password" label="密码" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.account_password }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type == 8" prop="executive_device" label="设备ID" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.executive_device }}
          </template>
        </el-table-column>

        <el-table-column v-if="searchData.type== 2" prop="number" label="发送数量" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.number }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 4 || searchData.type== 6" prop="intervals" label="间隔时间" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.intervals }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 4 || searchData.type== 6" prop="follow_total" label="目标总数" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.follow_total }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 4 || searchData.type== 6" prop="follow_index" label="开始下标" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.follow_index }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 4" prop="follow_note_id" label="帖子ID" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.follow_note_id }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 5 || searchData.type== 6" prop="follow_user_id" label="用户UID" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.follow_user_id }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 5 || searchData.type== 6" prop="follow_user_sec_id" label="用户secUid" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.follow_user_sec_id }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 1" prop="tiktok_user" label="Tik Tok用户" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.tiktok_user }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type != 7 && searchData.type != 8" prop="remark" label="备注" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type == 3 || searchData.type == 9 || searchData.type == 10 || searchData.type == 11 || searchData.type == 12 || searchData.type == 13" prop="proxy_info" label="协议信息" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.proxy_info }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 2 || searchData.type==3 " prop="video" label="视频链接地址" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.video }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 2 || searchData.type==3 || searchData.type==9 || searchData.type== 10|| searchData.type== 11|| searchData.type==12 || searchData.type==13 " prop="text" :label="textContent[searchData.type]" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.text }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 2" prop="rich_text" label="富文本" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.rich_text }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 2" prop="image" label="图片链接地址" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.image }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 2" prop="name_card" label="名片" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.name_card }}
          </template>
        </el-table-column>
        <el-table-column v-if="searchData.type== 4 || searchData.type== 6" prop="follow_region" label="地区" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.follow_region }}
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="searchData.type != 1 && searchData.type != 7 && searchData.type != 8 " size="small" type="success" plain @click="create(scope.row)">创建</el-button>
            <el-button size="small" type="primary" plain @click="view(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <addFrom :form-data-id="formDataId" :dialog-visible="dialogVisible" :executives="executives" @closeForm="closeForm" @success="init" />
      <div class="page">
        <!-- <YsMyPage :total="total" :size="10" @handlePage="handleCurrentChange" /> -->
        <el-pagination :page-sizes="[10, 20, 50, 100, 200]" :page-size="10" layout="sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'
import addFrom from './addForm'
export default {
  components: {
    addFrom
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        type: '1',
        page: 1,
        belong: null,
        order_created_at: true
      },
      textContent: {
        '2': '私信文字',
        '3': '作品文字',
        '9': '头像地址',
        '10': '昵称',
        '11': '博客地址',
        '12': '签名',
        '13': '邮箱'
      },
      role: 0,
      tableData: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      task_type: [],
      type: '2',
      executives: '',
      formDataId: 1
    }
  },
  watch: {
    'searchData.type': {
      handler(newValue, oldValue) {
        this.init()
      },
      deep: true
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    if (this.$route.query.account_id != null) {
      this.executives = this.$route.query.account_id
      console.log(this.executives)
      this.dialogVisible = true
    }
    const typeRes = await api.getEnum()
    if (typeRes && typeRes.code === 0 && typeRes.data && typeRes.data.task_type) {
      this.task_type = []
      Object.keys(typeRes.data.task_type).forEach((item, index) => {
        if (index === 0) {
          return
        }
        if (this.role === 0 && (index === 3 || index === 9 || index === 10 || index === 11 || index === 12 || index === 13)) {
          return
        }
        this.task_type.push({ label: typeRes.data.task_type[item], value: item })
      })
    }
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getTask(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    closeForm() {
      this.dialogVisible = false
      this.formDataId = 0
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    add() {
      this.dialogVisible = true
    },
    handleSizeChange(s) {
      this.searchData.page_size = s
      this.init()
    },
    view(row) {
      this.$router.push({
        name: 'TaskDetail', query: { id: row.id }
      })
    },
    create(row) {
      this.dialogVisible = true
      this.formDataId = Number(row.id)
    }
  }
}
</script>

<style lang="scss">
.btn-item {
  .el-input,
  .el-textarea {
    width: 50%;
    button {
      &:first-of-type {
        margin-left: 30px;
      }
    }
  }
}
</style>
