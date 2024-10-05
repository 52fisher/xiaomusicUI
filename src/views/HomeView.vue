<template>
    <el-text >欢迎使用小爱音箱操控面板 Pure主题</el-text>
    <div class="guidance">
        <img :src="guidance" alt="">
    </div>
</template>
<script setup>
import Setting from '@/components/Setting';
//导入assets中的guidance.png图片
import guidance from '../assets/guidance.png'
//首次使用设置 拉取最新设置
Setting.useSetting()
</script>
<style>
img{
    width: 60vw;
}
</style>
