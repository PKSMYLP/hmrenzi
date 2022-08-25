<template>
  <div v-loading="loading" class="departments-container">

    <el-card>

      <treeTools :tree-node="company" :is-root="false" @addDopt="addDopt" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <treeTools slot-scope="{ data }" :tree-node="data" @addDopt="addDopt" @editDopt="editDopt" @refreshDepts="getDepartments" />
    </el-tree>
    <!-- 放置新增弹层组件  -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="currentNode" @refreshDepts="getDepartments" />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import treeTools from './components/tree-tools'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept' // 引入新增部门组件
export default {
  components: {
    treeTools,
    AddDept
  },

  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      showDialog: false, // 显示窗体
      company: { },
      currentNode: {},
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 调用公司组织结构
    async getDepartments() {
      this.loading = true
      const { depts, companyName, companyManage } = await getDepartments()
      this.company = { name: companyName, manager: companyManage, id: '' }
      // this.departs = depts // 需要将其转化成树形结构
      this.departs = tranListToTreeData(depts, '') // 需要将其转化成树形结构
      this.loading = false
    },
    // 添加
    addDopt(node) {
      this.currentNode = node // 保存当前节点
      this.showDialog = true // 开启弹窗
    },
    // 编辑
    editDopt(node) {
      this.currentNode = node // 保存当前节点
      this.showDialog = true // 开启弹窗
      // 数据回显 直接赋值 页面也跟着变化
      // this.$refs.addDept.formData = node
      // 优化 通过展开运算符
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>

<style lang="scss" scoped>
  .departments-container {
  width: 900px;
  margin: 20px auto;
  }
::v-deep .el-row{
    width:100%;
  }
::v-deep .el-tree-node__content{
    padding-right: 25px;
  }
</style>

