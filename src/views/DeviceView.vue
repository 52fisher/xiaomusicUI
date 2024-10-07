<template>
<h2>{{ name }}</h2>
<div class="poweroff">
    <el-button type="primary" @click="handleCommand('关机')" :icon="SwitchButton" >关机</el-button>
    <el-button type="primary" @click="handleCommand('10分钟后关机')" :icon="SwitchButton" >10分钟后关机</el-button>
    <el-button type="primary" @click="handleCommand('30分钟后关机')" :icon="SwitchButton" >30分钟后关机</el-button>
    <el-button type="primary" @click="handleCommand('60分钟后关机')" :icon="SwitchButton" >60分钟后关机</el-button>
    <el-button type="primary" @click="handleCommand('刷新列表')" :icon="SwitchButton" >刷新列表</el-button>
    <!-- <el-icon><SwitchButton /></el-icon> -->
</div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'
import Setting from '@/components/Setting.js';

const route = useRoute()

const did=route.params.did
const name = route.params.name
const emits = defineEmits(['updateSetting'])
const handleCommand = (e) => {
    Setting.sendCmd({
        did: did, cmd: e 
    })
}
// console.log(miDeviceList,miDidList)
</script>
<style>
.poweroff {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
}
</style>