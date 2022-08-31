<template>
  <!-- el-upload 默认有插槽  -->
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"

      action="#"
      :file-list="fileList"
      list-type="picture-card"
      :on-change="onChange"
      :http-request="oRequest"
      :on-preview="onPreview"
      :limit="limit"
      :on-remove="onRemove"
      :before-upload="beforeUpload"
      :class="`${fileList.length===limit ? 'hideAdd' : ''}`"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      title="图片预览"
      :visible.sync="previewImgDialogVisible"
      width="80%"
    >
      <img style="width: 100%" :src="imgUrl">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDc6NQGrDQP9euvhDVXKsAF4dx2sSntkMj',
  SecretKey: 'B6zd2C7mCOL3VigPt88tPgiW6SaT6UdW'
})
console.log(cos)
export default {
  name: 'UploadImg',
  components: {},
  props: {
    limit: {
      type: Number,
      default: 1
    }
    // beforeUploadCheck: Function
  },
  data() {
    return {
      fileList: [

      ],
      previewImgDialogVisible: false,
      imgUrl: '',
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {
    onChange(file, fileList) {
      this.fileList = fileList
    },
    // 上传
    oRequest(data) {
      console.log(data)
      this.loading = true
      cos.putObject({
        Bucket: 'jokerp-1313544688', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-beijing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        console.log(err || data)
        this.loading = false
        // 图片上传失败
        if (err || data.statusCode !== 200) {
          return this.$message.error('图片上传失败，请重试!')
        }
        this.$emit('onSuccess', { url: 'https://' + data.Location })
      })
    },
    onRemove(file, fileList) {
      // file 当前被删除的文件
      // 剩余的文件列表
      this.fileList = fileList
    },
    onPreview(file) {
      this.previewImgDialogVisible = true
      this.imgUrl = file.url
    },
    beforeUpload(file) {
      if (this.beforeUploadCheck && !this.beforeUploadCheck(file)) {
        return false
      }
      // 一般分两种情况
      // 自定义 完全 ==》所有的逻辑取决于 自定义， 自定义和默认是相互排斥的
      // if (this.beforeUploadCheck) {
      //   return this.beforeUploadCheck(file)
      // }
      // 自定义 完全 ==》所有的逻辑取决于 先自定义 再默认， 自定义和默认是不相互排斥的
      // 自定义优先于默认的
      // if (this.beforeUploadCheck && !this.beforeUploadCheck(file)) {
      //   return false
      // }

      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error(`上传图片只能是 ${types.join(',')}} 格式!`)
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    }
  }
}
</script>
<style  lang="scss">
.hideAdd {
  .el-upload--picture-card{
    display: none;
  }
}
</style>
