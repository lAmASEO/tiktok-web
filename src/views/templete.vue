<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="名字">
          <el-input v-model="searchData.name" placeholder="名字" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="init()">查询</el-button>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="tableData" class="tableLimit" style="width: 100%">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="创建时间">
          <template slot-scope="scope">
            {{ new Date(scope.row.created_at) | getTime }}
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" plain @click="edit(scope.row)">编辑</el-button>
            <el-button size="small" type="warning" plain @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增" :visible.sync="dialogVisible" width="50%">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.username" />
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
        <YsMyPage :total="total" :size="10" @handlePage="handleCurrentChange" />
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
        name: '',
        page: 1,
        order_created_at: true
      },
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
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getGroup(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    add() {
      this.dialogVisible = true
    },
    handleAdd() {
      api.addUserInter(this.form).then((res) => {
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
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delUserInter(row).then(res => {
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
    }
  }
}
</script>

<style lang="scss">
</style>
