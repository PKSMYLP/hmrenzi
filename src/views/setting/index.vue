<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色管理" name="first">
        <!-- 新增角色按钮 -->
        <el-row style="height:60px">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="add"
          >新增角色</el-button>
        </el-row>
        <el-table
          v-loading="loading"
          border
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
            width="320"
          >
            <template slot-scope="scope">
              <el-button type="success" size="medium">分配权限</el-button>
              <el-button type="primary" size="medium" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" size="medium" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页组件 -->
          <el-pagination
            background

            :current-page.sync="page.page"
            :page-size.sync="page.pagesize"
            :page-sizes="[5,10, 20, 30]"
            layout="total,sizes,prev, pager, next"
            :total="total"
            @current-change="changePage"
            @size-change="changeSize"
          />
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="公司信息" name="second">
        <el-alert
          title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
          type="info"
        />
        <el-form label-width="120px" style="margin-top:50px">
          <el-form-item label="公司名称">
            <el-input v-model="formData.name" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="formData.companyAddress" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.mailbox" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <roleDialog ref="roleDialog" :dialog-visible.sync="dialogVisible" @refresh="getRoleList" />
    <!-- .sync 拆分 dialogVisible 属性和 update:dialogVisible 事件 -->
    <!-- <roleDialog :dialog-visible="dialogVisible"  @update:dialogVisible='接收子组件传递的值，改变dialogVisible的数据'/> -->
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
import roleDialog from './components/roleDialog.vue'
export default {
  components: { roleDialog },
  data() {
    return {

      activeName: 'first',
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10
      },
      loading: true,
      total: 0, // 记录总数
      dialogVisible: false, // 弹出框
      formData: {} // 公司数据
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    // 获取角色
    async getRoleList() {
      try {
        this.loading = true
        const { total, rows } = await getRoleList(this.page)
        this.total = total
        this.list = rows
      } finally {
        this.loading = false
      }
    },
    // 改变页码
    changePage(val) {
      // .sync 强制数据双向绑定
      // console.log(val)
      // console.log(this.page.page)
      this.getRoleList()
    },
    // 改变每一页的数量
    changeSize() {
      this.getRoleList()
    },
    // 新增角色
    add() {
      this.dialogVisible = true
    },
    // 编辑
    edit(row) {
      this.dialogVisible = true
      this.$refs.roleDialog.roleForm = { ...row }
    },
    // 删除
    async del(id) {
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', { type: 'warning' })
        // 调用删除接口
        await deleteRole(id)
        // 提示删除成功
        this.$message('删除成功')
        // 返回第一页
        this.page.page = 1
        // 刷新
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    // 公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

