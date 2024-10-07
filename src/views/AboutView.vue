<template>
  <div class="about">
    <div class="about_content">
      <h1>关于</h1>
      <p>本项目由 <el-link type="primary" href="https://github.com/hanxi">hanxi</el-link> 创建，主题由 <el-link type="primary" href="https://github.com/52fisher">52fisher</el-link> 设计
      </p>
      <h2>支持作者</h2>
      <p>hanxi的<el-link href="https://afdian.com/a/imhanxi">爱发电</el-link></p>
      <h2>使用说明</h2>
      <p>本项目仅供学习使用，不提供商业用途</p>
      <p>使用有疑问？再看一下指导<el-link href="#/">欢迎页</el-link></p>
      <h2>反馈</h2>
      <p>
        欢迎提出任何意见和建议，<el-link href="https://github.com/hanxi/xiaomusic">XiaoMusic</el-link>
        的<el-link href="https://github.com/hanxi/xiaomusic/issues">issue</el-link>
      </p>
      <p>Pure主题的反馈地址：<el-link href="https://github.com/52fisher/xiaomusicUI">xiaomusicUI</el-link>
      </p>
    </div>
    <footer>Powered by <el-link href="https://github.com/hanxi/xiaomusic">XiaoMusic</el-link>
      &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; Theme by <el-link href="https://github.com/52fisher">52fisher</el-link>
    </footer>
  </div>
</template>
<script setup>
const emits = defineEmits(['updateSetting'])
</script>
<style scoped>
.about {
  height: 70vh;
}

h1,
h2 {
  width: 100%;
  margin-top: 60px;
}
p {
  display: flex;
  align-items: center;
}
</style>
