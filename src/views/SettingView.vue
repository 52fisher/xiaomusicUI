<template>
    <el-scrollbar height="90vh">
        <el-form :model="data" label-width="200px" style="margin: 20px auto;" v-if="data">
            <!-- 主题配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>主题配置</span>
                    </div>
                </template>

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
                    <el-switch v-model="isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny"
                        active-text="深色主题" inactive-text="浅色主题" />
                </el-form-item>

                <el-form-item label="播放列表显示删除按钮">
                    <el-switch v-model="showDelBtn" />
                </el-form-item>
            </el-card>

            <!-- 小米设备配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>小米设备配置</span>
                    </div>
                </template>
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
            </el-card>

            <!-- 路径配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>路径配置</span>
                    </div>
                </template>

                <el-form-item label="音乐目录">
                    <el-input v-model="music_path" />
                </el-form-item>

                <el-form-item label="音乐下载目录">
                    <el-input v-model="download_path" placeholder="必须是 音乐目录 的子目录">
                        <template #prepend>{{ data.music_path }}/</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="临时文件目录">
                    <el-input v-model="temp_path" placeholder="必须是 音乐目录 的子目录">
                        <template #prepend>{{ data.music_path }}/</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="配置文件目录">
                    <el-input v-model="data.conf_path" />
                </el-form-item>

                <el-form-item label="缓存文件目录">
                    <el-input v-model="data.cache_dir" />
                </el-form-item>

                <el-form-item label="日志路径">
                    <el-input v-model="data.log_file" />
                </el-form-item>

                <el-form-item label="ffmpeg路径">
                    <el-input v-model="data.ffmpeg_location" />
                </el-form-item>
            </el-card>

            <!-- 网络与服务配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>网络与服务配置</span>
                    </div>
                </template>

                <el-form-item label="NAS的IP或域名">
                    <el-input v-model="data.hostname" />
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

                <el-form-item label="本地端口">
                    <el-input-number v-model="data.public_port" :min="0" />
                </el-form-item>

                <el-form-item label="代理地址">
                    <el-tooltip content="XIAOMUSIC_PROXY(ytsearch需要)" placement="bottom" effect="light">
                        <el-input v-model="data.proxy" placeholder="http://192.168.2.5:8080" />
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="网络歌曲过代理">
                    <el-switch v-model="data.web_music_proxy" />
                </el-form-item>
                <el-form-item label="开启调试日志">
                    <el-switch v-model="data.verbose" />
                </el-form-item>
            </el-card>

            <!-- 音乐搜索与下载配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>音乐搜索与下载配置</span>
                    </div>
                </template>

                <el-form-item label="歌曲下载方式">
                    <el-tooltip content="XIAOMUSIC_SEARCH" placement="bottom" effect="light">
                        <el-select v-model="data.search_prefix" placeholder="Select">
                            <el-option v-for="(item, index) in searchOptions" :key="index" :label="item"
                                :value="item" />
                        </el-select>
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="搜索歌曲数量">
                    <el-input-number v-model="data.search_music_count" :min="0" />
                </el-form-item>

                <el-form-item label="禁用下载">
                    <el-switch v-model="data.disable_download" />
                </el-form-item>

                <el-form-item label="转换为MP3">
                    <el-switch v-model="data.convert_to_mp3" />
                </el-form-item>

                <el-form-item label="去除MP3 ID3v2和填充">
                    <el-tooltip content="减少播放前延迟" placement="bottom" effect="light">
                        <el-switch v-model="data.remove_id3tag" />
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="均衡歌曲音量大小(loudnorm)">
                    <el-input v-model="data.loudnorm" placeholder="loudnorm=I=-14:TP=-1.5:LRA=6" />
                </el-form-item>

                <el-form-item label="启用yt-dlp-cookies">
                    <el-switch v-model="data.enable_yt_dlp_cookies" />
                    <WarningTip>需要先上传cookies文件</WarningTip>
                </el-form-item>

                <!-- 手动上传yt-dlp-cookies文件 -->
                <el-form-item label="上传yt-dlp-cookies文件">
                    <el-upload action="/uploadytdlpcookie" :show-file-list="false">
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                上传yt_dlp_cookies.txt文件,参考
                                <el-link href="https://xdocs.hanxi.cc/issues/210.html" type="primary"
                                    target="_blank" style="font-size:inherit;vertical-align:baseline;" :underline="false">文档</el-link>
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>

            </el-card>

            <!-- 音乐库配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>音乐库配置</span>
                    </div>
                </template>

                <el-form-item label="目录深度">
                    <el-input-number v-model="data.music_path_depth" />
                </el-form-item>

                <el-form-item label="忽略目录">
                    <el-tooltip content="使用逗号分割" placement="bottom" effect="light">
                        <el-input v-model="data.exclude_dirs" />
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="不扫描标签信息目录">
                    <el-tooltip content="使用逗号分割" placement="bottom" effect="light">
                        <el-input v-model="data.ignore_tag_dirs" />
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="启用目录监控">
                    <el-switch v-model="data.enable_file_watch" />
                    <WarningTip>会自动刷新音乐列表</WarningTip>
                </el-form-item>

                <el-form-item label="刷新列表延迟时间(秒)">
                    <el-input-number v-model="data.file_watch_debounce" :min="0" />
                </el-form-item>

                <el-form-item label="获取时长方式">
                    <el-select v-model="data.get_duration_type">
                        <el-option label="ffprobe" value="ffprobe" />
                        <el-option label="mutagen" value="mutagen" />
                    </el-select>
                </el-form-item>

                <el-form-item label="启用ID3标签写入文件">
                    <el-switch v-model="data.enable_save_tag" />
                </el-form-item>

                <el-form-item label="最近新增的歌曲数量">
                    <el-input-number v-model="data.recently_added_playlist_len" :min="0" />
                </el-form-item>
            </el-card>

            <!-- 语音控制配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>语音控制配置</span>
                    </div>
                </template>

                <el-form-item label="允许唤醒的命令">
                    <el-input v-model="data.active_cmd" />
                </el-form-item>

                <el-form-item label="播放本地歌曲口令">
                    <el-input v-model="data.keywords_playlocal" />
                </el-form-item>

                <el-form-item label="播放歌曲口令">
                    <el-input v-model="data.keywords_play" />
                </el-form-item>

                <el-form-item label="播放列表口令">
                    <el-input v-model="data.keywords_playlist" />
                </el-form-item>

                <el-form-item label="停止口令">
                    <el-input v-model="data.keywords_stop" />
                </el-form-item>

                <el-form-item label="本地搜索播放口令">
                    <el-tooltip content="会产生临时播放列表" placement="bottom" effect="light">
                        <el-input v-model="data.keywords_search_playlocal" />
                    </el-tooltip>

                </el-form-item>

                <el-form-item label="搜索播放口令">
                    <el-tooltip content="会产生临时播放列表" placement="bottom" effect="light">
                        <el-input v-model="data.keywords_search_play" />
                    </el-tooltip>
                </el-form-item>

                <el-form-item label="开启语音删除歌曲">
                    <el-switch v-model="data.enable_cmd_del_music" />
                </el-form-item>
            </el-card>

            <!-- 对话与提示配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>对话与提示配置</span>
                    </div>
                </template>

                <el-form-item label="获取对话记录">
                    <el-switch v-model="data.enable_pull_ask" />
                </el-form-item>

                <el-form-item label="获取对话间隔(秒)">
                    <el-input v-model="data.pull_ask_sec" />
                </el-form-item>

                <el-form-item label="特殊型号获取对话记录">
                    <el-switch v-model="data.get_ask_by_mina" />
                </el-form-item>

                <el-form-item label="停止提示音">
                    <el-input v-model="data.stop_tts_msg" />
                </el-form-item>

                <el-form-item label="单曲循环提示音">
                    <el-input v-model="data.play_type_one_tts_msg" />
                </el-form-item>

                <el-form-item label="全部循环提示音">
                    <el-input v-model="data.play_type_all_tts_msg" />
                </el-form-item>

                <el-form-item label="随机播放提示音">
                    <el-input v-model="data.play_type_rnd_tts_msg" />
                </el-form-item>

                <el-form-item label="单曲播放提示音">
                    <el-input v-model="data.play_type_sin_tts_msg" />
                </el-form-item>

                <el-form-item label="顺序播放提示音">
                    <el-input v-model="data.play_type_seq_tts_msg" />
                </el-form-item>
            </el-card>

            <!-- 播放与高级配置 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>播放与高级配置</span>
                    </div>
                </template>

                <el-form-item label="型号兼容模式">
                    <el-switch v-model="data.use_music_api" />
                </el-form-item>
                <el-form-item label="启用继续播放">
                    <el-switch v-model="data.continue_play" />
                    <WarningTip>可能存在兼容性问题</WarningTip>
                </el-form-item>

                <el-form-item label="歌曲播放间隔(秒)">
                    <el-input v-model="data.delay_sec" />
                </el-form-item>

                <el-form-item label="触屏版显示歌曲ID">
                    <el-input v-model="data.use_music_audio_id" />
                </el-form-item>

                <el-form-item label="触屏版显示歌曲分段ID">
                    <el-input v-model="data.use_music_id" />
                </el-form-item>

                <el-form-item label="模糊匹配阈值(0.1~0.9)">
                    <el-input-number v-model="data.fuzzy_match_cutoff" :precision="1" :step="0.1" :max="0.9"
                        :min="0.1" />
                </el-form-item>

                <el-form-item label="开启模糊搜索">
                    <el-switch v-model="data.enable_fuzzy_match" />
                </el-form-item>

                <el-form-item label="是否开启调试日志">
                    <el-select v-model="data.verbose">
                        <el-option label="开启" value="true" />
                        <el-option label="关闭" value="false" />
                    </el-select>
                </el-form-item>

                <el-form-item label="开启谷歌数据统计">
                    <el-switch v-model="data.enable_analytics" />
                    <WarningTip>开启后，会收集用户操作数据，用于优化功能。无敏感数据收集</WarningTip>
                </el-form-item>
            </el-card>

            <!-- 歌单与定时任务 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>歌单与定时任务</span>
                    </div>
                </template>

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
            </el-card>

            <!-- 操作按钮组 -->
            <el-card shadow="always" style="margin-bottom: 20px;">
                <template #header>
                    <div class="card-header">
                        <span>操作按钮</span>
                    </div>
                </template>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <el-button @click="refreshSetting()">重新拉取设置数据</el-button>
                    <el-tooltip content="本主题使用了列表缓存，可以使用该按钮拉取最新音乐列表" placement="bottom" effect="light">
                        <el-button @click="handleRefreshMusicList()">拉取最新音乐列表</el-button>
                    </el-tooltip>
                    <el-tooltip content="新旧版本功能不一致，刷新音乐标签可以获得音乐内置的封面、歌词等信息，提高体验" placement="bottom" effect="light">
                        <el-button @click="handleRefreshMusicTag()">刷新音乐标签</el-button>
                    </el-tooltip>
                </div>
            </el-card>

            <!-- 保存按钮 -->

            <el-button type="primary" @click="onSubmit" style="width: 80%;margin: 0 auto;display: flex;justify-content: center;">保存</el-button>

        </el-form>

        <div v-else class="loading-container">
            <el-loading v-loading="true" element-loading-text="正在加载设置数据..." />
        </div>
    </el-scrollbar>
</template>
<script setup>
import { ref, toRaw, computed, watch } from 'vue'
import Setting from '@/components/Setting.js';
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark, useStorage } from '@vueuse/core'
import Classical from '@/assets/classical.png'
import Accordion from '@/assets/accordion.gif'
import useSetting from '@/components/useSetting';
import api from '@/components/ApiList';
import fetchData from '@/components/fetchData';
import WarningTip from '@/components/WarningTip.vue';
import PathManager from '@/components/PathManager.js';
const emits = defineEmits(['updateSetting'])
//切换深色模式
const isDark = useDark()
//展示删除按钮
const showDelBtn = useStorage('showDelBtn', false);
//设置数据
const data = ref({});
const isLoading = ref(true);

// 初始化设置数据
const initSettingData = async () => {
    try {
        isLoading.value = true;
        const settingData = useSetting();

        // 等待数据加载完成
        await new Promise(resolve => {
            const checkData = () => {
                if (settingData.value && Object.keys(settingData.value).length > 0) {
                    data.value = settingData.value;
                    isLoading.value = false;
                    resolve();
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    } catch (error) {
        console.error('加载设置数据失败:', error);
        isLoading.value = false;
    }
};


// 初始化数据
initSettingData();

//音乐列表样式，classical为经典样式，accordion为手风琴样式
const musicListStyle = useStorage('musicListStyle', 'classical')

//默认在线搜索音乐的选项
const searchOptions = ref(['bilisearch:', 'ytsearch:'])

//所有的小米设备列表
const miDeviceList = computed(() => {
    if (!data.value || !data.value.device_list) {
        return [];
    }
    return data.value.device_list.map((item) => {
        return { label: `${item.hardware} ${item.miotDID} ${item.name}`, did: item.miotDID }
    });
});

//已选中的小米设备
const checkList = computed(() => {
    if (!data.value || !data.value.mi_did) {
        return [];
    }
    return data.value.mi_did.split(',');
});


// music/download和music/tmp绑定music路径
const pathManager = new PathManager(data, {
  download_path: {
    fullPathKey: 'download_path',
    defaultSubPath: 'download'
  },
  temp_path: {
    fullPathKey: 'temp_path',
    defaultSubPath: 'tmp'
  }
  // 未来可以在这里轻松添加更多路径配置
});

// 解构计算属性
const { music_path, download_path, temp_path } = pathManager.getComputedProps();

// 监听data变化，更新相关数据
watch(data, pathManager.getInitWatchHandler(), { deep: true, immediate: true });

//选中的小米设备
const checks = computed({
    get() {
        return checkList.value;
    },
    set(val) {
        if (!data.value) return;
        data.value.mi_did = val.filter(Boolean).join(",");
    }
});


// 原有方法保持不变，但增加数据存在性检查
const changeMusicListStyle = (value) => {
    Setting.setCache('musicListStyle', value)
    musicListStyle.value = value
};

const refreshSetting = () => {
    isLoading.value = true;
    const XMSetting = useSetting(true);

    // 等待刷新后的数据加载完成
    new Promise(resolve => {
        const checkData = () => {
            if (XMSetting.value && Object.keys(XMSetting.value).length > 0) {
                data.value = XMSetting.value;
                isLoading.value = false;
                emits('updateSetting');
                ElMessage({
                    message: "已刷新设置数据",
                    type: "success",
                });
                resolve();
            } else {
                setTimeout(checkData, 100);
            }
        };
        checkData();
    });
};

// 其他方法保持不变，但增加必要的数据检查
const handleRefreshMusicList = () => {
    Setting.getMusicList();
    ElMessage({
        message: "已刷新音乐列表数据",
        type: "success",
    });
};

const handleRefreshMusicTag = () => {
    fetchData(api.refreshMusicTag, {}, (res) => {
        res.ret == "ok" && ElMessage({
            message: "刷新音乐标签命令已经发送至后端，请稍后通过播放列表查看结果",
            type: "success",
        });
    });
};

function onSubmit() {
    if (!data.value) return;
    Setting.saveSetting(toRaw(data.value))
    emits('updateSetting')
}
</script>
<style scoped>
img {
    width: 300px;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-card {
    transition: all 0.3s ease;
}

.el-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>