<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="账号UID">
          <el-input v-model="searchData.unique_id" placeholder="账号UID" clearable />
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="tableData" class="tableLimit" style="width: 100%" :border="true" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <!-- <el-table-column prop="name" label="创建时间" width="130" align="center">
          <template slot-scope="scope">
            {{ new Date(scope.row.created_at) | getTime }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="device_id" label="设备 ID" align="center" /> -->
        <el-table-column prop="avatar" label="头像" align="center" width="100">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column v-if="isDeviceId && role == 1" prop="device_name" label="设备名称" align="center" />
        <el-table-column v-if="isDeviceId" prop="device_remarks" label="设备备注" align="center" />

        <el-table-column prop="nickname" label="昵称" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="group_name" label="组名" align="center" />
        <el-table-column prop="unique_id" label="账号UID" align="center" width="200" />
        <el-table-column prop="posts_number" label="帖子数量" align="center" />
        <el-table-column prop="follow_number" label="关注人数" align="center" />
        <el-table-column prop="friends_number" label="好友数量" align="center" />
        <el-table-column prop="send_number" label="发送次数" align="center" />
        <el-table-column prop="remarks" label="备注" align="center">
          <template scope="scope">
            <div class="input-box">
              <el-input v-model="scope.row.remarks" size="small" @blur="handleInputBlur(scope.row)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column width="260" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="isDeviceId" :disabled="scope.row.id == device_id" size="small" type="success" plain @click="handCheck(scope.row)">{{ scope.row.id == device_id ? '当前账号' : '切换账号' }}</el-button>
            <el-button size="small" type="primary" plain @click="handPut(scope.row.id)">重置次数</el-button>
            <el-button size="small" type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="添加账号到组" :visible.sync="dialogVisible" width="50%">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="组ID">
            <el-input v-model="form.group_id" @click="dialogGroupId = true" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAdd()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="50%">
        <el-form ref="form" :model="modifyForm" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.username" />
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEdit()">确 定</el-button>
        </span>
      </el-dialog>
      <div class="page">
        <!-- <YsMyPage :total="total" :size="10" @handlePage="handleCurrentChange" /> -->
        <el-pagination :page-sizes="[10, 20, 50, 100, 200]" :page-size="10" layout="sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        group_id: null,
        device_id: null,
        unique_id: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      tableData: [],
      groupTableData: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      dialogGroupId: false,
      modifyDialogVisible: false,
      form: {
        account_list: [],
        group_id: ''
      },
      modifyForm: {
        account_list: [],
        group_id: ''
      },
      role: null,
      isDeviceId: false,
      device_id: null
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.init()
  },
  methods: {
    async init() {
      this.searchData.group_id = this.$route.query.group_id || null
      this.searchData.device_id = this.$route.query.device_id || null
      // this.searchData.unique_id = this.$route.query.unique_id || null
      if (this.searchData.device_id != null) {
        this.isDeviceId = true
      }
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      let res = ''
      let name = ''
      let remarks = ''
      if (this.searchData.group_id != null || this.searchData.device_id != null || this.searchData.unique_id != null) {
        if (this.isDeviceId) {
          const deviceRes = await api.getDevice({ id: this.searchData.device_id })
          this.device_id = deviceRes.data.data[0].current_account
          name = deviceRes.data.data[0].name
          remarks = deviceRes.data.data[0].remarks
        }
        res = await api.getAcount(this.searchData)
        if (res && res.code === 0 && res.data) {
          res.data.data.map(item => { item.device_name = name })
          res.data.data.map(item => { item.device_remarks = remarks })
          this.tableData = res.data.data
          this.total = res.data.count
        }
      } else {
        if (this.role === 1) {
          res = await api.getAcountAll(this.searchData)
          if (res && res.code === 0 && res.data) {
            this.tableData = res.data.data
            this.total = res.data.count
          }
        }
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleAdd() {
      console.log(this.form.group_id)
      if (this.form.group_id == null) {
        return
      }
      this.form.group_id = Number(this.form.group_id)
      api.putAcount(this.form).then((res) => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.init()
        }
      })
    },
    edit(row) {
      this.modifyDialogVisible = true
      this.modifyForm = row
    },
    handleEdit() {
      api.putUserInter(this.modifyForm).then(res => {
        if (res.code === 0) {
          this.modifyDialogVisible = false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delAcount(row).then(res => {
          if (res.code === 0) {
            this.init()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(row) {
      this.form.account_list = []
      row.forEach(item => {
        this.form.account_list.push(item.id)
      })
    },
    getGroupId(id) {
      this.dialogGroupId = false
      this.form.group_id = id
    },
    async handPut(id) {
      await api.putSend(id)
    },
    handleSizeChange(s) {
      this.searchData.page_size = s
      this.init()
    },
    async handCheck(row) {
      const res = await api.postTask({
        type: 8,
        switch_account: row.unique_id,
        executive_device: Number(this.searchData.device_id)
      })
      if (res.code === 0) {
        this.init()
      }
    },
    async handleInputBlur(row) {
      await api.putAcountRemarks({ id: row.id, remarks: row.remarks })
    }
  }
}
</script>

<style lang="scss">
</style>
