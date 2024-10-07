<template>
    <el-text >欢迎使用小爱音箱操控面板 Pure主题</el-text>
    <div class="guidance">
        <img :src="guidance" alt="">
    </div>
</template>
<script setup>
//导入assets中的guidance.png图片
import guidance from '../assets/guidance.png'
const emits = defineEmits(['updateSetting'])
</script>
<style>
img{
    width: 60vw;
}
</style>
