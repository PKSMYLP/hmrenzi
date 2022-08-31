<template>
  <div class="dashboard-container">
    <div v-color="color" class="dashboard-text">name: {{ name }}</div>
    <ImageUpload :before-upload-check="beforeUploadCheck" @onSuccess="handleSuccess" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ImageUpload from '@/components/ImageUpload'
export default {
  name: 'Dashboard',
  components: { ImageUpload },
  data() {
    return {
      color: 'red'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // import('@/vendor/Export2Excel').then(excel => {
    //   excel.export_json_to_excel({
    //     header: ['姓名', '手机号', '入职日期', '聘用形式'],
    //     data: [['张三', '13399999', '2020-2020-2020', '正式']],
    //     filename: 'excel-list', // 非必填
    //     autoWidth: true, // 非必填
    //     bookType: 'xlsx' // 非必填
    //   })
    // })

  },
  methods: {
    beforeUploadCheck(file) {
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
    },
    handleSuccess({ url }) {
      console.log(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
