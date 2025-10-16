<template>
    <el-row class="tac">
        <el-col>
            <h2 class="nav-title">小爱音箱操控面板</h2>
            <el-menu default-active="/" :router="true" :mode="menuMode" :collapse="isCollapse" class="nav-menu">
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
                <el-menu-item index="/M3u2Json">
                    <el-icon>
                        <IconJson />
                    </el-icon>
                    <span>M3U转换器</span>
                </el-menu-item>
                <el-menu-item index="/DownloadTool">
                    <el-icon>
                        <IconMusic />
                    </el-icon>
                    <span>歌曲下载工具</span>
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
import { ref, onMounted, onUnmounted } from 'vue'
import {
    Operation,
    User,
    VideoPlay,
    Setting as IconSetting,
} from '@element-plus/icons-vue'
import IconAbout from './icons/IconAbout.vue';
import IconJson from './icons/IconJson.vue';
import IconMusic from './icons/IconMusic.vue';

defineProps({
    miEnabledDevices: Array
})

// 菜单模式
const menuMode = ref('vertical') // 默认垂直菜单
const isCollapse = ref(false) // 是否折叠菜单（只显示图标）

// 处理窗口大小变化
const handleResize = () => {
    const windowWidth = window.innerWidth;

    // 在小屏幕下折叠菜单，只显示图标
    if (windowWidth <= 600) {
        isCollapse.value = true;
        // 移动端默认使用横向布局
        menuMode.value = 'horizontal';

    } else if (windowWidth <= 768) {
        // 中等屏幕下可选择是否折叠
        // 这里可以根据实际需求调整判断条件
        isCollapse.value = windowWidth <= 680;
        // 移动端默认使用横向布局
        menuMode.value = 'horizontal';

    } else {
        // 桌面端不折叠
        isCollapse.value = false;
    }
}

onMounted(() => {
    // 初始化菜单状态
    handleResize();
    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
    // 清理事件监听
    window.removeEventListener('resize', handleResize);
})
</script>
<style scoped>
.nav-title {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    margin-bottom: 16px;
}

.nav-menu {
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 移动端样式 */
@media (max-width: 768px) {
    .nav-title {
        display: none;
    }

    .nav-menu {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background-color: #ffffff;
        border-bottom: 1px solid #e6e6e6;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    /* 适配移动端的菜单项间距 */
    .el-menu--horizontal>.el-menu-item {
        padding: 0 10px;
        min-width: auto;
    }

    /* 适配移动端的子菜单 */
    .el-menu--horizontal .el-sub-menu .el-menu {
        top: 100%;
        left: 0;
        right: 0;
    }

    .el-menu--horizontal>.el-sub-menu:nth-child(1) {
        margin-left: auto;
    }
}

/* 小屏幕样式 - 只显示图标 */
@media (max-width: 600px) {

    .nav-menu .el-menu-item span,
    .nav-menu .el-sub-menu__title span {
        display: none;
    }

    .nav-menu .el-menu-item,
    .nav-menu .el-sub-menu__title {
        padding: 0 8px !important;
        width: auto;
    }

    .el-menu--horizontal>.el-sub-menu:nth-child(1) {
        margin-left: auto;
    }
}

/* 为确保页面内容不被固定菜单遮挡，添加顶部内边距 */
body {
    padding-top: 60px;
}

/* 如果页面中已有其他固定头部，可以根据实际情况调整或移除上面的padding */
</style>