<template>

  <el-dialog
    :title="`${roleForm.id ? '修改' :'新增'}角色`"
    width="30%"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required:true,message:'角色必填',trigger:'blur'}]"
      >
        <el-input v-model="roleForm.name" placeholder="请输入角色" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitRole">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  methods: {
    // 取消弹框
    handleClose() {
      // this.dialogVisible = false
      // 修改父组件dialogVisible的值
      this.$emit('update:dialogVisible', false)
      // 重置表单  resetFields 和 ele-item 的 prop 将roleForm数据改成初始状态
      this.$refs.roleDialogForm.resetFields()
      // 编辑之后进行清空roleForm
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    // 确认提交
    async submitRole() {
      // 表单校验 validate不传参 返回Promise
      try {
        await this.$refs.roleDialogForm.validate()
        // 加载中 优化效果
        this.loading = true
        // 调用新增接口 或修改接口 用过roleForm有无id判断
        this.roleForm.id ? await updateRole(this.roleForm) : await addRole(this.roleForm)
        // 调用父组件获取角色的方法
        // this.$parent.getRoleList()
        this.$emit('refresh')
        // 提示新增成功或修改成功 用过roleForm有无id判断
        this.$message.success(`${this.roleForm.id ? '修改' : '新增'}成功`)
        // 关闭弹层
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
