<template>
  <div class="page-tools">
    <el-card>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col>
          <div :class="`before ${type}`">
            <i v-if="showIcon" :class="`el-icon-${type}`" />
            <!-- 定义前面得插槽 -->
            <slot name="before" />
          </div>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end" align="middle">
            <div>
              <!-- 定义后面的插槽 -->
              <slot name="after" />
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PageTools',
  components: {},
  props: {
    type: {
      type: String,
      default: 'info',
      validator(value) {
        // value   type传递的值
        // 限制类型
        if (['info', 'success', 'warning', 'error'].includes(value)) {
          return true
        } else { return false }
      }
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {

  },
  methods: {

  }
}

</script>
<style scoped lang='scss'>
  .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
      display: inline-block;
      padding: 0px 10px;
      border-radius: 3px;
      i {
        margin-right: 5px;
      }
      &.info {
        border: 1px solid rgba(145, 213, 255, 1);
        background: rgba(230, 247, 255, 1);
        i {
          color: #409eff;
        }
      }

      &.success {
        border: 1px solid #c2e7b0;
        background: #f0f9eb;
        i {
          color: #67c23a;
        }
      }

      &.warning {
        border: 1px solid #f5dab1;
        background: #fdf6ec;
        i {
          color: #e6a23c;
        }
      }

      &.error {
        border: #fbc4c4;
        background: #fef0f0;
        i {
          color: #f56c6c;
        }
      }
  }
 }
</style>
