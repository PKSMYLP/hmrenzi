<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <!-- 放置表单 -->
          <el-form ref="infoForm" label-width="120px" style="margin-left: 120px; margin-top:30px" :model="userInfo" :rules="rules">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="userInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input v-model="userInfo.password" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <userinfo />
        </el-tab-pane>

        <el-tab-pane label="岗位信息">
          <jobinfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import jobinfo from './components/job-info.vue'
import userinfo from './components/user-info.vue'
export default {
  name: '',
  components: { jobinfo, userinfo },
  data() {
    return {
      userInfo: {
        //   专门存放基本信息
        username: '',
        password: '',
        password1: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  computed: {
    useId() {
      return this.$route.params.id
    }
  },
  watch: {},
  created() {

  },
  mounted() {
    this.getUserDetailById()
    this.updatedInfo()
  },
  methods: {
    // 获取信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.useId)
    },
    // 修改保存密码
    async updatedInfo() {
      try {
        await this.$refs.infoForm.validated()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password1 })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style scoped>

</style>
