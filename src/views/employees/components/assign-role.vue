<template>
  <el-dialog
    title="分配角色"
    :visible="value"
    :before-close="handleClose"
  >
    <!-- {{ this.$attrs }}
    {{ $attrs }} -->

    <el-checkbox-group v-model="roleIds">

      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'HrsaasAssignRole',
  inheritAttrs: false,
  // v-model 也可以通过 model:{prop: 'checked', event: 'change'} 字段来修改属性和事件
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getUserDetailById()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('change', false)
      this.roleIds = []
    },
    // 获取角色列表
    async getRoleList() {
      try {
        const { rows } = await getRoleList()
        this.roleList = rows
      } catch (e) {
        console.log(e)
      }
    },
    // 获取用户详情
    async getUserDetailById() {
      const { roleIds } = await getUserDetailById(this.$attrs['user-id'])
      this.roleIds = roleIds
    },
    // 确定角色
    async btnOk() {
      try {
        this.loading = true
        await assignRoles({ id: this.$attrs['user-id'], roleIds: this.roleIds })
        this.handleClose()
        this.$message.success('角色分配成功')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
