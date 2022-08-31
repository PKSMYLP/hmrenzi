<template>
  <el-dialog title="新增员工" :visible="dialogVisible" :before-close="handleClose">
    <!-- 表单 -->
    <el-form ref="formData1" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop=" timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置一个tree组件 -->
        <el-tree
          v-show="showTree"
          v-loading="loading"
          :data="treeData"
          :props="defaultProp"
          :default-expand-all="true"
          @node-click="selectNode"
        />

      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="handleClose">取消</el-button>
          <el-button v-loading="loadingBtn" type="primary" size="small" @click="submit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hireType: EmployeeEnum.hireType, // 在data中定义数据
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      defaultProp: {
        label: 'name'
      },
      showTree: false, // 控制树形的显示或者隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      loadingBtn: false,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('update:dialogVisible', false)
      // 重置表单 （当处于编辑重新赋值resetFileds()将不会重置，需要配合formData初始化）
      this.$refs.formData1.resetFields()
      // 数据初始化
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 关闭树形数据
      this.showTree = false
    },
    // 获取部门数据请求
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 选择部门名
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 确定新增员工
    async submit() {
      try {
        // 先检验
        await this.$refs.formData1.validate()
        // 按钮加载中，避免重复
        this.loadingBtn = true
        // 调用新增接口
        await addEmployee(this.formData)
        // 提示新增成功
        this.$message.success('新增成功')
        // 触发父组件 更新页面
        this.$emit('refresh')
        // 关闭弹窗
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingBtn = false
      }
    }
  }
}
</script>
