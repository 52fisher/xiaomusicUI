<template>
    <el-row class="tac">
        <el-col>
            <h2>小爱音箱操控面板</h2>
            <el-menu default-active="/" :router="true" :collapse="isCollapse">
                <el-sub-menu index="/Devices">
                    <template #title>
                        <el-icon>
                            <Operation />
                        </el-icon>
                        <span>小爱设备控制</span>
                    </template>
                    <template v-for="item in miEnabledDevices" :key="item.did">
                        <el-menu-item :index="`/device/${item.did}`"
                            :route="{ name: 'Device', params: { did: item.did } }">
                            {{ item.name }}
                        </el-menu-item>
                    </template>
                </el-sub-menu>
                <el-menu-item index="/Play">
                    <el-icon>
                        <VideoPlay />
                    </el-icon>
                    <span>播放列表</span>
                </el-menu-item>
                <el-menu-item index="/AccountSetting">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>账号设置</span>
                </el-menu-item>
                <el-menu-item index="/Setting">
                    <el-icon>
                        <IconSetting />
                    </el-icon>
                    <span>设置</span>
                </el-menu-item>
                <el-menu-item index="/About">
                    <el-icon>
                        <IconAbout />
                    </el-icon>
                    <span>关于</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>
<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import {
    Operation,
    User,
    VideoPlay,
    Setting as IconSetting,
} from '@element-plus/icons-vue'
import IconAbout from './icons/IconAbout.vue';
// import Setting from './Setting.js';
defineProps({
    miEnabledDevices: Array
})
// const { miDeviceList, miDidList } = Setting.getMiDeviceList()
// console.log('%csrc\components\NavMenu.vue:54 miDidList', 'color: #007acc;', miDidList);
const isCollapse = ref(false)

const handleResize = () => {
    if (window.innerWidth <= 768) {
        isCollapse.value = true;
    } else {
        isCollapse.value = false;
    }
}
onMounted(() => {
    window.addEventListener('resize', handleResize);
})
onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
});

</script>
<style>
h2 {
    font-size: clamp(1rem, 2.5vw, 1.5rem)
}
</style>