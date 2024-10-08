<template>
    <div class="poweroff">
        <el-button type="primary" @click="handleCommand('关机')" :icon="SwitchButton">关机</el-button>
        <el-button type="primary" @click="handleCommand('10分钟后关机')" :icon="SwitchButton">10分钟后关机</el-button>
        <el-button type="primary" @click="handleCommand('30分钟后关机')" :icon="SwitchButton">30分钟后关机</el-button>
        <el-button type="primary" @click="handleCommand('60分钟后关机')" :icon="SwitchButton">60分钟后关机</el-button>
        <el-button type="primary" @click="handleCommand('刷新列表')" :icon="SwitchButton">刷新列表</el-button>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'
import fetchData from '@/components/fetchData';
import api from '@/components/ApiList';
const route = useRoute()
const did = route.params.did
const emits = defineEmits(['updateSetting'])
const handleCommand = (e) => {
    fetchData(api.sendCmd, {
        did: did,
        cmd: e
    }, (res) => {
        //ElMessage
        res.ret == "OK" && ElMessage({
            message: e + " 命令已发送至小爱设备",
            type: "success",
        })
    })
}
</script>
<style>
.poweroff {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
}
</style>