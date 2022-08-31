<template>
  <div class="app-container">
    <PageTools :show-icon="showIcon" :type="type">
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="头像" align="center">
          <template slot-scope="{row}">
            <img
              v-imgerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto "
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              alt=""
              @click="showErCodeDialog(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="scope">
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState==undefined" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <!-- slot-scope="{row}"获取当前表单的数据 -->
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="AssignRole(row.id)">角色</el-button>
            <el-button ref="btn" type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          v-show="total>0"
          :total="total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[5,10,20]"
          background
          layout="total,sizes, prev, pager, next"
          @current-change="getEmployeeList1"
          @size-change="getEmployeeList1"
        />
      </el-row>
    </el-card>
    <!-- 新增 -->
    <AddDemployee :dialog-visible.sync="dialogVisible" :refresh="getEmployeeList1" />
    <!-- 查看 -->
    <AssignRole ref="assignRole" v-model="AssignRoleDialog" :user-id="currentId" />
    <el-dialog title="头像二维码" :visible.sync="ercodeDialog" custom-class="canvaseq">
      <canvas id="canvas" />
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: {
    AddDemployee,
    AssignRole
  },

  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 10 // 当前页的数据量
      },
      showIcon: true,
      type: 'info',
      list: [], // 接数据的
      total: 0, // 总数,
      dialogVisible: false,
      loading: false,
      idArr: [],
      ercodeDialog: false,
      AssignRoleDialog: false,
      currentId: ''

    }
  },

  created() {
    this.getEmployeeList1()
  },
  methods: {
    // 调用员工详细信息
    async getEmployeeList1() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
        this.idArr = rows.map(ele => ele.id)
        // console.log(this.idArr)
        // 当前页面没有数据时会请求前一页的数据 前提total>0
        if (rows.length === 0 && total > 0) {
          this.page.page = this.page.page - 1
          this.getEmployeeList1()
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === +cellValue)
      // return obj ? obj.value : '未知'    ?. == &&   ??==||

      return obj?.value || '未知'
    },
    // 新增
    add() {
      this.dialogVisible = true
    },
    // 删除
    async del(id) {
      try {
        await this.$confirm('确认删除？', { type: 'warning' })
        await delEmployee(id)
        this.getEmployeeList1()
        // console.log(delEmployee(id))
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // delshuj() {
    //   // setInterval(() => {
    //   //   this.idArr.forEach(ele => this.delEmployee(ele))
    //   // }, 300)
    // }
    // 导出
    async exportData() {
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      // console.log(rows)
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      //
      const data = this.fromJson(headers, rows)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data: data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          multiHeader: [['姓名', '主要信息', '', '', '', '', '']],
          merges: ['A1:A2', 'B1:G1']

        })
      })
    },
    // 处理数据
    fromJson(headers, rows) {
      return rows.map(ele =>
        Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(headers[key])
          } else if (headers[key] === 'formOfEmployment') {
            // 需要引入EmployeeEnum常量进行处理
            const obj = EmployeeEnum.hireType.find(obj => obj.id === +ele[headers[key]])
            return obj?.value || '非正式'
          }
          return ele[headers[key]]
        })
      )
    },
    // 二维码图片
    async showErCodeDialog(staffPhoto) {
      if (!staffPhoto) return this.$message.error('该用户还未设置头像')
      this.ercodeDialog = true
      // 对话框 不显示时只能获取到自身 ，不能获取到里面的懂dom元素 ，直接在看页面结构
      await this.$nextTick()
      const dom = document.querySelector('#canvas')
      QrCode.toCanvas(dom, staffPhoto)
    },
    // 查看角色
    async AssignRole(id) {
      this.currentId = id
      await this.$refs.assignRole.getRoleList()
      this.AssignRoleDialog = true
    }

  }
}
</script>

<style lang="scss" >
.canvaseq{
  text-align: center;
}

</style>

