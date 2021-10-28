<template>
  <div>
    <!-- <div class="searchBox">
            <el-input v-model="searchInput" class="searchInput" placeholder="请输入内容"></el-input>
             <el-button icon="el-icon-search" style="margin-left:10px;" size='mini' circle></el-button>
        </div> -->
    <el-button type="primary" icon="el-icon-plus" size="small" style="margin: 20px 0 20px 20px" @click="clickAddAccount">添加账号</el-button>
    <el-table :data="tableData" height="700" style="width: 100%">
      <el-table-column label="创建时间" min-width="250">
        <template slot-scope="scope">
          {{ timestampToTime(scope.row.CreateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="UserId" label="用户ID" min-width="300" />
      <el-table-column prop="Username" label="姓名" min-width="180" />
      <el-table-column label="状态" min-width="180">
        <template slot-scope="scope">
          {{
            scope.row.Status == 1 ? "正常" : scope.row.Status == 2 ? "封禁" : ''
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteOneAccount(scope.row.UserId)">删除</el-button>
          <el-button type="text" size="small" @click="modifyAccount(scope.row)">
            修改
          </el-button>
          <el-button v-if="role == 1" size="small" type="text" @click="handleCreate(scope.row)">
            下单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
            background
            style="margin-left:35%;margin-top:30px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination> -->
    <div class="paginationBox">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30, 40]" :page-size="page_size" :total="count" :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog class="addAccountDialogClass" title="新增账号" :visible.sync="addAccountDialog">
      <el-form>
        <el-form-item :rules="[{ required: true, trigger: 'blur' }]" label="用户名" label-width="15%">
          <el-input ref="usernameInput" v-model="usernameAdd" autocomplete="off" style="width: 200px" @blur="userInputOut()" />
        </el-form-item>
        <div ref="userTipDiv" class="userTip" />
        <el-form-item :rules="[{ required: true, trigger: 'blur' }]" label="密码" label-width="15%">
          <el-input ref="passwordInput" v-model="passwordAdd" autocomplete="off" type="password" style="width: 200px" @blur="passwordInputOut()" />
        </el-form-item>
        <div ref="passwordTipDiv" class="passwordTip" />
        <template>
          <el-form-item label="状态" label-width="15%" :rules="[{ required: true, trigger: 'blur' }]">
            <el-select v-model="valueAdd" clearable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddAccount()">取 消</el-button>
        <el-button type="primary" @click="determineAddAccount()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改账号" :visible.sync="modifyAccountDialog">
      <el-form>
        <el-form-item label="用户名" label-width="15%">
          <el-input ref="usernameInput" v-model="usernameModify" disabled autocomplete="off" style="width: 200px" />
        </el-form-item>
        <el-form-item label="密码" label-width="15%">
          <el-input ref="passwordInput" v-model="passwordModify" autocomplete="off" type="password" style="width: 200px" />
        </el-form-item>
        <template>
          <el-form-item label="状态" label-width="15%">
            <el-select v-model="valueModify" clearable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModifyAccount()">取 消</el-button>
        <el-button type="primary" @click="determineModifyAccount()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left: 50px">
        <el-form-item label="账单的归属人" style=''>
          <el-input v-model="temp.belong" disabled />
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="timestamp">
                <el-date-picker
                    v-model="temp.createTime"
                    type="datetime"
                    placeholder="Please pick a date"
                />
                </el-form-item> -->
        <el-form-item label="操作人id">
          <el-input v-model="temp.operator_id" disabled />
        </el-form-item>
        <el-form-item label="套餐">
          <el-select v-model="valueQuota" clearable placeholder="请选择" @change="check1">
            <el-option v-for="(item,index) in storeArr" :key="index" :label="item.name + '(剩余:' + item.available_quota + ')'" :value="item.id" />
          </el-select>
          <!-- <div class="quotaBox">
                    <div style="margin:0" class="checkQuota"></div>
                    <div class="checkQuota"></div>
                    <div class="checkQuota"></div>
                </div> -->
        </el-form-item>
        <!-- <el-form-item label="套餐id">
                <el-input v-model="temp.store_id" />
                </el-form-item> -->
        <el-form-item label="描述">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="请输入描述" maxlength="50" show-word-limit />
        </el-form-item>

        <!-- <el-form-item label="可用数量">
                <el-input v-model="temp.available_quota" />
                </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="Addpackage()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUser } from '@/api/index'
export default {
  data() {
    return {
      tableData: [],
      total: 17,
      page: 1,
      page_size: 10,
      count: 0,
      searchInput: '',
      addAccountDialog: false,
      modifyAccountDialog: false,
      dialogFormVisible: false,
      valueAdd: '',
      usernameAdd: '',
      passwordAdd: '',
      usernameModify: '',
      passwordModify: '',
      valueModify: '',
      accountInfo: undefined,
      valueQuota: '',
      currentPage: 1,
      temp: {
        belong: '',
        operator_id: '',
        record_id: '',
        store_id: '',
        remarks: ''
      },
      options: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '封禁'
        }
      ],
      options1: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '封禁'
        }
      ],
      userId: undefined,
      userB: undefined,
      store_id: undefined,
      record_id: undefined,
      storeArr: [],
      role: undefined
    }
  },
  created() {
    this.userId = JSON.parse(window.sessionStorage.getItem('userInfo')).i
    this.userB = JSON.parse(window.sessionStorage.getItem('userInfo')).b
    this.role = JSON.parse(window.sessionStorage.getItem('userInfo')).r
    this.getAccountAll()
  },
  mounted() { },
  methods: {
    // 套餐选择下拉框
    check1(val) {
      console.log(this.storeArr, 321)

      for (let i = 0; i < this.storeArr.length; i++) {
        if (this.storeArr[i].id === val) {
          this.record_id = this.storeArr[i].id
          this.store_id = this.storeArr[i].store_id
        }
      }

      // console.log(val)
    },
    // 格式化时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    // 点击下单
    async handleCreate(item) {
      this.storeArr = []
      this.temp.belong = item.Username
      this.temp.operator_id = this.userId
      this.temp.remarks = ''
      this.valueQuota = ''
      // 获取配额信息
      const res = await this.$getQuotaAll({ dealer_id: this.userB })
      const { Data } = res.data.data
      for (let i = 0; i < Data.length; i++) {
        const red = await this.$getStore(Data[i].store_id)

        if (red.data.data) {
          this.$set(Data[i], 'name', red.data.data.name)
        }
      }
      this.storeArr = Data
      console.log(this.storeArr, 963)
      this.dialogFormVisible = true
    },
    // 添加订单
    async Addpackage() {
      if (this.valueQuota === '') {
        this.$message('请选择套餐')
      } else {
        this.dialogFormVisible = false
        const obj = {}
        obj.belong = this.temp.belong
        obj.operator_id = parseFloat(this.temp.operator_id)
        obj.record_id = this.record_id
        obj.store_id = this.store_id
        obj.remarks = this.temp.remarks
        const res = await this.$addorder(obj)
        if (res.data.code === 0) {
          this.$message({
            message: '下单成功',
            type: 'success'
          })
          this.getAccountAll()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      }
    },
    // 判断账号输入是否为空
    userInputOut() {
      if (this.usernameAdd === '') {
        this.$refs.userTipDiv.innerHTML = '账号不能为空'
      } else {
        this.$refs.userTipDiv.innerHTML = ''
      }
    },
    // 判断密码是否为空
    passwordInputOut() {
      if (this.passwordAdd === '') {
        this.$refs.passwordTipDiv.innerHTML = '密码不能为空'
      } else {
        this.$refs.passwordTipDiv.innerHTML = ''
      }
    },
    // 添加账号初始化
    clearInput() {
      this.usernameAdd = ''
      this.passwordAdd = ''
      this.valueAdd = ''
    },
    // 点击弹出添加账号框
    clickAddAccount() {
      this.clearInput()
      this.addAccountDialog = true
    },
    // 修改账号初始化
    clearInput1() {
      this.usernameModify = ''
      this.passwordModify = ''
      this.valueModify = ''
    },
    // 分页获取所有账号信息
    async getAccountAll() {
      const params = {
        page: this.page,
        page_size: this.page_size
      }
      if (this.role !== 0) {
        params.belong_waiter = this.userId
      }
      const res = await getUser(params)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.count = res.data.count
      }
    },
    // 取消添加
    cancelAddAccount() {
      this.addAccountDialog = false
      //   this.clearInput();
    },
    // 确认添加账号
    async determineAddAccount() {
      if (this.usernameAdd && this.passwordAdd && this.valueAdd) {
        const params = {
          username: this.usernameAdd,
          password: this.passwordAdd,
          status: this.valueAdd,
          belong_dealer: this.userB,
          belong_waiter: this.userId
        }
        const res = await this.$addAccount(params)
        if (res.data.code === 0) {
          this.getAccountAll()
          this.addAccountDialog = false
          //   this.clearInput();
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
          //   this.clearInput();
        }
      } else {
        this.$message({
          message: '请输入正确的账号信息',
          type: 'warning'
        })
      }
    },
    // 修改指定账号
    modifyAccount(item) {
      this.clearInput1()
      this.modifyAccountDialog = true
      this.accountInfo = { ...item }
      this.usernameModify = item.Username
      this.valueModify = item.Status
    },
    // 取消修改
    cancelModifyAccount() {
      this.modifyAccountDialog = false
      //   this.clearInput1();
    },
    // 确认修改账号
    async determineModifyAccount() {
      if (this.passwordModify && this.valueModify) {
        const params = { ...this.accountInfo }
        params.Username = this.usernameModify
        params.Password = this.passwordModify
        params.Status = this.valueModify
        await this.$modifyAccountOne(params)
        this.$message({
          message: '修改成功！',
          type: 'success'
        })
        this.modifyAccountDialog = false
        this.getAccountAll()
      } else {
        this.$message({
          message: '请输入正确的账号信息',
          type: 'warning'
        })
      }
    },
    // 删除指定账号
    deleteOneAccount(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const pro = new Promise((resolve, reject) => {
            const res = this.$deleteAccountOne(id)
            resolve(res)
          })
          pro.then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getAccountAll()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分页(点击切换时)
    // 改变每页多少条数据时
    handleSizeChange(val) {
      this.page_size = val
      this.getAccountAll()
    },
    // 切换当前页时
    handleCurrentChange(val) {
      this.page = val
      this.getAccountAll()
    }
  }
}
</script>
  <style lang="scss" scoped>
.searchBox {
  margin-top: 50px;
  padding-left: 20px;
  .searchInput {
    width: 200px;
  }
}
::v-deep.el-input .el-input__inner {
  height: 30px;
  line-height: 30px;
}
::v-deep.el-select .el-input__inner {
  width: 200px;
  height: 30px;
  line-height: 30px;
}
.quotaBox {
  width: 400px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .checkQuota {
    width: 120px;
    height: 160px;
    border: 1px solid #eee;
    margin-left: 20px;
  }
  .checkQuota1 {
    width: 120px;
    height: 160px;
    border: 1px solid #eee;
  }
}
::v-deep.el-textarea .el-textarea__inner {
  height: 100px !important;
  resize: none;
}

.paginationBox {
  padding: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .el-table {
  padding: 0 20px;
}

::v-deep.addAccountDialogClass .el-form-item {
  margin: 0;
}

.userTip {
  padding-left: 15%;
  height: 20px;
  line-height: 20px;
  color: red;
}

.passwordTip {
  padding-left: 15%;
  height: 20px;
  line-height: 20px;
  color: red;
}
</style>
