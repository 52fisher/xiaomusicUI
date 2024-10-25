<template>
    <div class="palyer_wrapper" v-if="miEnabledDevices">
        <el-row>
            <el-col :span="24">
                <div class="options">
                    <div class="opts_search">
                        <el-button :icon="Search" circle @click="enableSearch = !enableSearch" />
                    </div>
                    <el-select v-if="enableSearch" v-model="searchMusicName" style="width: 160px" reserve-keyword
                        filterable remote :remote-method="musicSearch" clearable :options="options" :loading="loading"
                        placeholder="请输入要搜索的歌曲名称" @change="handleSearch()">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                    <div class="device_icon">
                        <IconDevice />
                    </div>
                    <el-select v-model="currentDeviceDid" placeholder="当前设备" size="default" style="width: 160px">
                        <el-option v-for="item in miEnabledDevicesWithLocal" :key="item.name" :label="item.name"
                            :value="item.did" />
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <ClassicalStyle v-if="musicListStyle == 'classical'" @handle-play="handlePlay"></ClassicalStyle>
        <AccordionStyle v-else-if="musicListStyle == 'accordion'" @handle-play="handlePlay"></AccordionStyle>
        <Player :currentTrack="currentTrack" @next-track="nextTrack" @prev-track="prevTrack" @random-track="randomTrack"
            @handle-play="handlePlay" @updateCurrentTrack="updateCurrentTrack">
        </Player>

    </div>
    <GoAccountView v-else>
    </GoAccountView>

</template>
<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import IconDevice from '@/components/icons/IconDevice.vue'
import Setting from '../components/Setting.js'
import GoAccountView from './GoAccountView.vue'
import ClassicalStyle from '@/components/ClassicalStyle.vue'
import AccordionStyle from '@/components/AccordionStyle.vue'
import Player from '@/components/Player.vue'
import { useStorage } from '@vueuse/core'
import cover from '/defaultcover.jpg'
import api from '@/components/ApiList'
import fetchData from '@/components/fetchData';

//音乐列表样式
const musicListStyle = useStorage('musicListStyle', 'classical');

const enableSearch = ref(false);
const searchMusicName = ref('');

const loading = ref(false);
const options = ref([]);

const currentDeviceDid = useStorage('currentDeviceDid', "0");
const currentTrack = useStorage('currentTrack', { name: '', url: '', album: '', lyric: "", cover: cover, })

const musicList = useStorage('musicList', {})

const emits = defineEmits(['updateSetting'])
// watch(miDidList, () => {
//     miEnabledDevices.value = toRaw(miDidList.value)[0]['did'];
// })
const currentMusicListName = useStorage('currentMusicListName', '全部');
const props = defineProps({
    miEnabledDevices: {
        type: Object, default: () => [{ name: "本机", did: "0", play_type: 0 }]
    }
})
const miEnabledDevicesWithLocal = computed(() => {
    return [
        ...props.miEnabledDevices,
        { name: "本机", did: "0", play_type: 0 },
    ]
})
const currentDeviceName = computed(() => {

    return miEnabledDevicesWithLocal.value.find((item) => item.did == currentDeviceDid.value)?.name
})

const list = computed(() => {
    const item = currentMusicListName.value;
    return item ? musicList.value[item] : [];
})

// const changeVolume = () => {
//     Setting.setVolume({
//         did: miEnabledDevices.value,
//         volume: volume.value
//     })
// }

// const handleRemotePlay = (e) => {
//     //拼接形成参数 {"did":"568532341","cmd":"播放列表全部|嘉宾 - 张远"}
//     // const config = {
//     //     did: miEnabledDevices.value,
//     //     cmd: '播放列表' + currentMusicListName.value + '|' + e
//     // }
//     const config = {
//         did: miEnabledDevices.value,
//         cmd: '播放歌曲' + e + '|'
//     }
//     playState.value = !playState.value
//     // console.log('%csrc\views\PlayView.vue:66 e', 'color: #007acc;', e);
//     Setting.sendCmd(config)
// }
// const handleRemotePlayAll = (e) => {
//     // console.log('%csrc\views\PlayView.vue:115 e', 'color: #007acc;', e);
//     playState.value = !playState.value
//     Setting.sendCmd({
//         did: miEnabledDevices.value,
//         cmd: '播放列表' + e + '|' + toRaw(musicList.value)[e][0]
//     })
// }
// const handlePause = () => {
//     //修改playstate
//     playState.value = !playState.value
//     //cmd 关机
//     Setting.sendCmd({
//         did: miEnabledDevices.value,
//         cmd: '关机'
//     })
// }
// const handlePlay = (e) => {
//     console.log('%csrc\views\PlayView.vue:119 e', 'color: #007acc;', e);
//     const { musicInfo, error } = Setting.getMusicUrl(e);
//     // console.log('%csrc\views\PlayView.vue:121 url', 'color: #007acc;', url);
//     if (error.value) {
//         ElMessage({
//             message: error.value,
//             type: 'error',
//             duration: 1000
//         })
//         return;
//     }
//     playState.value = 1;
//     watchEffect(() => {
//         if (musicInfo.value) {
//             currentMusicName.value = musicInfo.value.name;
//             musicUrl.value = musicInfo.value.url;
//         }
//     })
// }
// const handleStar = () => {
//     //只有currentMusicName 正在播放的音乐才能收藏
//     if (!currentMusicName.value) {
//         ElMessage({
//             message: '只有正在播放的音乐才能收藏哦',
//             type: 'error',
//         })
//         return;
//     }
//     const config = {
//         did: miEnabledDevices.value,
//         cmd: '加入收藏'
//     }
//     // console.log('%csrc\views\PlayView.vue:66 e', 'color: #007acc;', e);
//     Setting.sendCmd(config)
// }
// watchEffect(() => {
//     musicUrl.value
// })
// const handleNext = () => {
//     //cmd
//     const config = {
//         did: miEnabledDevices.value,
//         cmd: '下一首'
//     }
//     Setting.sendCmd(config)
// }
// const handlePrev = () => {
//     //cmd
//     const config = {
//         did: miEnabledDevices.value,
//         cmd: '上一首'
//     }
//     Setting.sendCmd(config)
// }
// const handleLoop = (loopText) => {
//     loop.value = (loop.value + 1) % 3;
//     //延迟发送请求
//     // console.log('%csrc\views\PlayView.vue:236 loopText', 'color: #007acc;', loopText);
//     debounce(function () {
//         const config = {
//             did: miEnabledDevices.value,
//             cmd: loopText
//         }
//         Setting.sendCmd(config)
//         Setting.setCache('loop', loop.value)
//         // console.log('%csrc\views\PlayView.vue:243 cmd命令执行', 'color: #007acc;');
//     }, 500)()
// }
const musicSearch = (name) => {
    if (name == "") {
        return;
    }
    loading.value = true;
    //用fetchData改写
    fetchData(api.searchMusic + name, "", (res) => {
        console.log('%csrc\views\PlayView.vue:213 res', 'color: #007acc;', res);
        options.value = res.map((item) => {
            return { value: item, label: item }
        });
        loading.value = false;
    })

}
const handleSearch = () => {
    // playState.value = 0;
    //cmd
    if (currentDeviceDid.value != "0") {
        Setting.sendCmd({
            did: currentDeviceDid.value,
            cmd: '播放歌曲' + searchMusicName.value + '|',
        })
        return
    }
    console.log('%csrc\views\PlayView.vue:233 searchMusicName.name', 'color: #007acc;', searchMusicName.name);
    handlePlay(searchMusicName.value)

}

const handlePlayAll = () => {
    // If the list is empty, show a message to the user
    if (list.value.length == 0) {
        // showMsg('没有发现音乐，尝试在主页刷新一下列表吧')
        ElMessage({
            message: '没有发现音乐，尝试在主页刷新一下列表吧',
            type: 'error',
        })
        return;
    }
    // If the current device is a remote device, send the cmd to the backend
    if (currentDeviceDid.value != "0") {
        // Use fetchData to send the request
        fetchData(api.sendCmd, {
            did: currentDeviceDid.value,
            cmd: ` ${title}`
        }, (res) => {
            // res.ret == "OK" && showMsg(` ${miEnabledDevices.value.name}  ${title} `, ' ')
            // res.ret == "OK" && showMsg(`已发送 ${title} 到 ${miEnabledDevices.value.name}`)
            res.ret == "OK" && ElMessage({
                message: `已发送 ${title} 到${currentDeviceName.value}`,
                type: 'success',
            })
        })
        return;
    }
    // If the current device is a local device, play the first song in the list
    handlePlay(list.value[0])
}
/**
 * @description: Handle play button click
 * @param {string} name The name of the music to play
 */
const handlePlay = (name) => {
    // If the current device is a remote device, send the cmd to the backend
    console.log('%csrc\views\PlayView.vue:278 接收到歌曲名称 name', 'color: #007acc;', name, currentDeviceDid.value);
    if (currentDeviceDid.value != "0") {
        //使用fetchData改写
        fetchData(api.sendCmd, {
            did: currentDeviceDid.value,
            cmd: '播放列表' + currentMusicListName.value + "|" + name
        }, (res) => {
            // res.ret == "OK" && showMsg(`已发送 播放${name} 到 ${miEnabledDevices.value.name}`)
            res.ret == "OK" && ElMessage({
                message: `已发送 播放${name} 到${currentDeviceName.value}`,
                type: 'success',
            })
            updateCurrentTrack(name, true)
        })
        return;
    }
    // If the current device is a local device, play the first song in the list

    updateCurrentTrack(name)
}
const nextTrack = () => {
    // console.log('%csrc\views\ListView.vue:111 list.value', 'color: #007acc;', list.value);
    //miEnabledDevices的did不为空，则说明是小爱设备，应该发送cmd命令控制上一首或下一首
    if (currentDeviceDid.value != "0") {
        fetchData(api.sendCmd, {
            did: currentDeviceDid.value,
            cmd: '下一首'
        })
        ElMessage({
            message: `已发送 下一首 到${currentDeviceName.value}`,
            type: 'success',
        })
        return;
    }
    let index = list.value.indexOf(currentTrack.value.name)
    if (index === list.value.length - 1) {
        index = 0
    } else {
        index += 1
    }
    handlePlay(list.value[index])
}
const prevTrack = () => {
    if (currentDeviceDid.value != "0") {
        fetchData(api.sendCmd, {
            did: currentDeviceDid.value,
            cmd: '上一首'
        })
        ElMessage({
            message: `已发送 上一首 到${currentDeviceName.value}`,
            type: 'success',
        })
        return;
    }
    let index = list.value.indexOf(currentTrack.value.name)
    if (index === 0) {
        index = list.value.length - 1
    } else {
        index -= 1
    }
    handlePlay(list.value[index])
}
const randomTrack = () => {
    const index = Math.floor(Math.random() * list.value.length)
    handlePlay(list.value[index])
}
const updateCurrentTrack = (name, remote = false) => {
    //使用fetchData改写
    fetchData(api.musicInfoWithTag + encodeURIComponent(name), '', (res) => {
        currentTrack.value = {
            name: res.name,
            url: remote ? "" : res.url,
            album: res.tags.album,
            cover: res.tags.picture || cover,
            lyric: res.tags.lyrics,
            singer: res.tags.artist
        }
        // Save the current track to local storage
        localStorage.setItem('currentTrack', JSON.stringify(currentTrack.value))
    })
}
</script>
<style lang="scss">
.options {
    display: flex;
    justify-content: space-evenly;
    align-items: right;

    .opts_search {
        margin-right: 20px;
        margin-left: auto;
    }
}

.musiclist_wraper {

    display: flex;
    align-items: start;
    position: relative;
    width: 50vw;
    padding: 10px 0;

    .el-collapse {
        width: 40vw;
        max-width: 800px
    }

    .musiclist {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 40vw;
        max-width: 700px;

        li {
            cursor: pointer;
            height: 38px;
            padding: 10px;
            display: flex;
            justify-content: left;
            align-items: center;

            &:hover {
                text-decoration: none;
                background-color: #EEE;

                .song_info,
                .song_opts {
                    display: flex;
                    font-size: 18px;
                }
            }

            .song_info {
                width: 70%;
                display: block;
            }

            .song_opts {
                width: 16%;
                margin: auto;
                display: none;
                //内元素间距隔开

                justify-content: space-evenly;
                align-items: center;
            }
        }
    }

    .control_pannel {
        width: 38px;
        min-height: 200px; //高度自适应
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        flex-direction: column;
        gap: 20px;

        svg {
            color: inherit;
            fill: currentColor;
        }
    }
}

.music_control {
    .current_name {
        font-size: 16px;
        width: fit-content;
        overflow: hidden;
        animation: marquee 10s linear infinite;
    }

    @keyframes marquee {
        0% {
            transform: translateX(0);
        }

        100% {
            transform: translateX(-100%);
        }
    }

    audio {
        width: 90%;
    }
}

.tabs {
    min-height: 480px;
}
//媒体查询，宽度小于1200px时 .musiclist_wraper .musiclist 的宽度设置为300px
@media screen and (max-width: 1200px) {
    .musiclist_wraper .musiclist {
        width: 300px;
    }
}
</style>