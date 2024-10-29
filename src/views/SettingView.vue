<template>
    <el-scrollbar height="90vh">
        <el-form :model="data" label-width="200px" style="max-width: 600px;margin:20px auto;" v-if="data">
            <el-form-item label="音乐列表样式">
                <el-radio-group v-model="musicListStyle" @change="changeMusicListStyle">
                    <el-popover placement="top-start" title="经典标签样式预览" :width="400" trigger="hover">
                        <template #reference>
                            <el-radio label="1" value="classical" :border="true">经典标签样式</el-radio>
                        </template>
                        <template #default>
                            <el-text>包括下载、全部、所有歌曲、收藏，屏蔽其他标签页</el-text>
                            <img :src="Classical" alt="">
                        </template>
                    </el-popover>

                    <el-popover placement="top-start" title="手风琴样式预览" :width="400" trigger="hover">
                        <template #reference>
                            <el-radio label="2" value="accordion" :border="true">手风琴样式</el-radio>
                        </template>
                        <template #default>
                            <el-text>展示所有标签页，包括子文件夹、电台、有声书等</el-text>
                            <img :src="Accordion" alt="">
                        </template>
                    </el-popover>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="主题颜色">
                <el-switch v-model="isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" active-text="深色主题"
                    inactive-text="浅色主题" />
            </el-form-item>
            <el-form-item label="播放列表显示删除按钮">
                <el-switch v-model="showDelBtn" />
                </el-form-item>
            <el-form-item label="本地数据操作">
                <el-button @click="refreshSetting()">重新拉取设置数据</el-button>
            </el-form-item>
            <el-form-item label="音乐标签、列表控制" label-position="right">
                <el-tooltip content="本主题使用了列表缓存，可以使用该按钮拉取最新音乐列表" placement="bottom" effect="light">
                    <el-button @click="handleRefreshMusicList()">拉取最新音乐列表</el-button>
                </el-tooltip>
                <el-tooltip content="新旧版本功能不一致，刷新音乐标签可以获得音乐内置的封面、歌词等信息，提高体验" placement="bottom" effect="light">
                    <el-button @click="handleRefreshMusicTag()">刷新音乐标签</el-button>
                </el-tooltip>
            </el-form-item>
            <el-divider />
            <el-form-item label="选择设备(至少勾选1个)">
                <el-checkbox-group v-model="checks" v-if="miDeviceList">
                    <template v-for="(item, index) in miDeviceList" :key="index">
                        <el-checkbox :label="item.label" :value="item.did" />
                    </template>
                </el-checkbox-group>
                <el-text type="warning" v-else>未发现可用的小爱设备，请尝试点击 <b>重新拉取数据</b>或根据<el-link
                        href="https://github.com/hanxi/xiaomusic/issues/99">FAQ</el-link>的内容在网页登录小米账号过网页验证</el-text>
            </el-form-item>
            <el-form-item label="设备分组配置">
                <el-input v-model="data.group_list" placeholder="did1:组名1,did2:组名1,did3:组名2" />
            </el-form-item>
            <el-form-item label="音乐目录">
                <el-input v-model="data.music_path" />
            </el-form-item>
            <el-form-item label="音乐下载目录">
                <el-input v-model="download_path" placeholder="必须是 音乐目录 的子目录">
                    <template #prepend>{{ data.music_path }}/</template>
                </el-input>
            </el-form-item>
            <el-form-item label="配置文件目录">
                <el-input v-model="data.conf_path" />
            </el-form-item>
            <el-form-item label="缓存文件目录">
                <el-input v-model="data.cache_dir" />
            </el-form-item>
            <el-form-item label="ffmpeg路径">
                <el-input v-model="data.ffmpeg_location" />
            </el-form-item>
            <el-form-item label="日志路径">
                <el-input v-model="data.log_file" />
            </el-form-item>
            <el-form-item label="允许唤醒的命令">
                <el-input v-model="data.active_cmd" />
            </el-form-item>
            <el-form-item label="忽略目录(逗号分割)">
                <el-input v-model="data.exclude_dirs" />
            </el-form-item>
            <el-form-item label="目录深度">
                <el-input-number v-model="data.music_path_depth" />
            </el-form-item>
            <el-form-item label="歌曲下载方式">
                <el-tooltip content="XIAOMUSIC_SEARCH" placement="bottom" effect="light">
                    <el-select v-model="data.search_prefix" placeholder="Select">
                        <el-option v-for="( item, index ) in searchOptions" :key="index" :label="item" :value="item" />
                    </el-select>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="代理地址">
                <el-tooltip content="XIAOMUSIC_PROXY(ytsearch需要)" placement="bottom" effect="light">
                    <el-input v-model="data.proxy" placeholder="http://192.168.2.5:8080" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="去除MP3 ID3v2和填充">
                <el-tooltip content="减少播放前延迟" placement="bottom" effect="light">
                    <el-switch v-model="data.remove_id3tag" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="转换为MP3">
                <el-switch v-model="data.convert_to_mp3" />
            </el-form-item>
            <el-form-item label="禁用下载">
                <el-switch v-model="data.disable_download" />
            </el-form-item>
            <el-form-item label="触屏版显示歌曲ID">
                <el-input v-model="data.use_music_audio_id" />
            </el-form-item>
            <el-form-item label="触屏版显示歌曲分段ID">
                <el-input v-model="data.use_music_id" />
            </el-form-item>
            <el-form-item label="模糊匹配阈值(0.1~0.9)">
                <!-- <el-input v-model="data.fuzzy_match_cutoff" /> -->
                <el-input-number v-model="data.fuzzy_match_cutoff" :precision="1" :step="0.1" :max="0.9" :min="0.1" />
            </el-form-item>
            <el-form-item label="开启模糊搜索">
                <el-switch v-model="data.enable_fuzzy_match" />
            </el-form-item>
            <el-form-item label="型号兼容模式">
                <el-switch v-model="data.use_music_api" />
            </el-form-item>
            <el-form-item label="启用继续播放">
                <el-tooltip content="可能存在兼容性问题" placement="bottom" effect="light">
                    <el-switch v-model="data.continue_play" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="监听端口">
                <el-tooltip content="修改后需要重启" placement="bottom" effect="light">
                    <el-input v-model="data.port" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="外网访问端口">
                <el-tooltip content="0表示跟监听端口一致" placement="bottom" effect="light">
                    <el-input v-model="data.public_port" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="获取对话间隔(秒)">
                <el-input v-model="data.pull_ask_sec" />
            </el-form-item>
            <el-form-item label="歌曲播放间隔(秒)">
                <el-input v-model="data.delay_sec" />
            </el-form-item>
            <el-form-item label="停止提示音">
                <el-input v-model="data.stop_tts_msg" />
            </el-form-item>
            <el-form-item label="播放本地歌曲口令">
                <el-input v-model="data.keywords_playlocal" />
            </el-form-item>
            <el-form-item label="播放歌曲口令">
                <el-input v-model="data.keywords_play" />
            </el-form-item>
            <el-form-item label="停止口令">
                <el-input v-model="data.keywords_stop" />
            </el-form-item>
            <el-form-item label="歌单地址">
                <el-input v-model="data.music_list_url" />
            </el-form-item>
            <el-form-item label="歌单内容">
                <el-link type="primary" :underline="false" href="https://github.com/hanxi/xiaomusic/issues/78"
                    target="_blank">格式文档</el-link>
                <el-input v-model="data.music_list_json" type="textarea" :rows="5"
                    :autosize="{ minRows: 2, maxRows: 8 }" />
            </el-form-item>
            <el-form-item label="定时任务">
                <el-link type="primary" :underline="false" href="https://github.com/hanxi/xiaomusic/issues/182"
                    target="_blank">格式文档</el-link>
                <el-input v-model="data.crontab_json" type="textarea" :rows="5"
                    :autosize="{ minRows: 2, maxRows: 8 }" />
            </el-form-item>
            <el-form-item label-position="right">
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </el-scrollbar>
</template>
<script setup>
import { ref, toRaw } from 'vue'
import Setting from '@/components/Setting.js';
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark, useStorage, computedAsync } from '@vueuse/core'
import Classical from '@/assets/classical.png'
import Accordion from '@/assets/accordion.gif'
import useSetting from '@/components/useSetting';
import api from '@/components/ApiList';
import fetchData from '@/components/fetchData';

const emits = defineEmits(['updateSetting'])
//切换深色模式
const isDark = useDark()
//展示删除按钮
const showDelBtn = useStorage('showDelBtn', false);
//设置数据
const data = useSetting();
//音乐列表样式，classical为经典样式，accordion为手风琴样式
const musicListStyle = useStorage('musicListStyle', 'classical')

//默认在线搜索音乐的选项
const searchOptions = ref(['bilisearch:', 'ytsearch:'])

//所有的小米设备列表
const miDeviceList = computedAsync(async () => {

    const deviceList = await data.value.device_list
    return deviceList.map((item) => {
        return { label: `${item.hardware} ${item.miotDID} ${item.name}`, did: item.miotDID }
    })
})
//已选中的小米设备
const checkList = computedAsync(async () => {
    const mi_did = await data.value.mi_did;
    return mi_did.split(',')
}, [])

//下载目录
const d_path = ref(data.value.download_path.replace(data.value.music_path + "/", ''))
const download_path = computed({
    get() {
        return d_path.value
    },
    set(val) {
        d_path.value = val
        data.value.download_path = data.value.music_path + "/" + val;
    }
})
//选中的小米设备 需要存储所有的did，用逗号分隔
const checks = computed({
    get() {
        return checkList.value
    },
    set(val) {
        checkList.value = val
        // console.log('%csrc\views\SettingView.vue:198 checkList.value', 'color: #007acc;', checkList.value);
        data.value.mi_did = val.filter(Boolean).join(",")
    }
})

const changeMusicListStyle = (value) => {
    Setting.setCache('musicListStyle', value)
    musicListStyle.value = value
}

const refreshSetting = () => {
    // Setting.clearSetting()
    const XMSetting = useSetting(true)
    data.value = XMSetting.value;
    emits('updateSetting');

    ElMessage({
        message: "已刷新设置数据",
        type: "success",
    })
}
const handleRefreshMusicList = () => {
    Setting.getMusicList();
    ElMessage({
        message: "已刷新音乐列表数据",
        type: "success",
    })
}
const handleRefreshMusicTag = () => {
    fetchData(api.refreshMusicTag, {}, (res) => {
        res.ret == "ok" && ElMessage({
            message: "刷新音乐标签命令已经发送至后端，请稍后通过播放列表查看结果",
            type: "success",
        })
    })
}
function onSubmit() {
    Setting.saveSetting(toRaw(data.value))
    emits('updateSetting')
}

</script>
<style scoped>
img {
    width: 300px;
}
</style>