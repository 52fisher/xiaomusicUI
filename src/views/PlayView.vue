<template>
    <div class="palyer_wrapper" v-if="miDidList.length">
        <el-row>
            <el-col :span="24">
                <div class="options">
                    <div class="opts_search">
                        <el-button :icon="Search" circle @click="enableSearch = !enableSearch" />
                    </div>
                    <el-select-v2 v-if="enableSearch" v-model="searchMusicName" style="width: 160px" filterable remote
                        :remote-method="musicSearch" clearable :options="options" :loading="loading"
                        placeholder="请输入要搜索的歌曲名称" @change="handleSearch(searchMusicName)" />
                    <el-select v-model="currentDevice" placeholder="当前设备" size="default" style="width: 160px"
                        v-if="miDidList">
                        <el-option v-for="item in miDidList" :key="item.name" :label="item.name" :value="item.did" />
                    </el-select>
                </div>
            </el-col>
        </el-row>

        <el-tabs v-model="currentMusicListName" type="card" class="tabs"
            v-if="musicList && (musicListStyle == 'classical')" @tab-change="handleTabChange(currentMusicListName)">
            <template v-for="(item, index) in renderMusicListTitle" :key="index">
                <el-tab-pane :label="item" :name="item">
                    <div class="musiclist_wraper">
                        <el-scrollbar height="56vh">
                            <ul class="musiclist">
                                <template v-for="(v, i) in renderMusicList[item]" :key="i">
                                    <li @dblclick="handleRemotePlay(v)" @click="handleRemotePlay(v)">
                                        <div class="song_info"><el-text>{{ v }}</el-text></div>
                                        <div class="song_opts">
                                            <el-icon @click.stop="handlePlay(v)">
                                                <IconPlay />
                                            </el-icon>
                                            <el-icon @click.stop="handleDelete(v, item)">
                                                <IconDelete />
                                            </el-icon>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                        </el-scrollbar>
                        <div class="control_pannel">
                            <el-button circle>
                                <el-icon v-if="playState" title="在小爱设备上播放" @click="handleRemotePlayAll(item)">
                                    <IconPlay />
                                </el-icon>
                                <el-icon v-else title="暂停播放" @click="handlePause()">
                                    <IconPause />
                                </el-icon>
                            </el-button>
                            <el-button @click="handlePrev()" circle title="上一首">
                                <el-icon>
                                    <IconPrev />
                                </el-icon>
                            </el-button>
                            <el-button @click="handleNext()" circle title="下一首">
                                <el-icon>
                                    <IconNext />
                                </el-icon>
                            </el-button>
                            <el-button @click="handleLoop(loopName[loop])" circle :title="loopName[loop]">
                                <IconSingleLoop v-if="loop === 0" />
                                <IconListLoop v-else-if="loop === 1" />
                                <IconRandom v-else />
                            </el-button>
                            <el-button @click="handleStar()" circle title="收藏当前在小爱设备上播放的歌曲">
                                <IconStar />
                            </el-button>
                            <el-slider v-model="volume" :min="0" :max="100" @change="changeVolume" vertical
                                height="100px" />
                        </div>
                    </div>

                </el-tab-pane>
            </template>
        </el-tabs>
        <div class="musiclist_wraper" v-if="musicList && (musicListStyle == 'accordion')">
            <el-scrollbar height="56vh">
                <el-collapse v-model="currentMusicListName" accordion @change="handleTabChange(currentMusicListName)">
                    <template v-for="(item, index) in renderMusicListTitle" :key="index">
                        <el-collapse-item :title="item" :name="item">
                            <ul class="musiclist">
                                <template v-for="(v, i) in renderMusicList[item]" :key="i">
                                    <li @dblclick="handleRemotePlay(v)" @click="handleRemotePlay(v)">
                                        <div class="song_info"><el-text>{{ v }}</el-text></div>
                                        <div class="song_opts">
                                            <el-icon @click.stop="handlePlay(v)">
                                                <IconPlay />
                                            </el-icon>
                                            <el-icon @click.stop="handleDelete(v, item)">
                                                <IconDelete />
                                            </el-icon>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                        </el-collapse-item>
                    </template>
                </el-collapse>
            </el-scrollbar>
            <div class="control_pannel">
                <el-button circle>
                    <el-icon v-if="playState" title="在小爱设备上播放" @click="handleRemotePlayAll(currentMusicListName)">
                        <IconPlay />
                    </el-icon>
                    <el-icon v-else title="暂停播放" @click="handlePause()">
                        <IconPause />
                    </el-icon>
                </el-button>
                <el-button @click="handlePrev()" circle title="上一首">
                    <el-icon>
                        <IconPrev />
                    </el-icon>
                </el-button>
                <el-button @click="handleNext()" circle title="下一首">
                    <el-icon>
                        <IconNext />
                    </el-icon>
                </el-button>
                <el-button @click="handleLoop(loopName[loop])" circle :title="loopName[loop]">
                    <IconSingleLoop v-if="loop === 0" />
                    <IconListLoop v-else-if="loop === 1" />
                    <IconRandom v-else />
                </el-button>
                <el-button @click="handleStar()" circle title="收藏当前在小爱设备上播放的歌曲">
                    <IconStar />
                </el-button>
                <el-slider v-model="volume" :min="0" :max="100" @change="changeVolume" vertical height="100px" />
            </div>
        </div>
        <div class="pagination-block" v-if="musicList && (musicListStyle == 'accordion')">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[6, 10, 12, 15]" :disabled="disabled" layout="total, sizes, prev, pager, next, jumper"
                :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <div class="music_control" v-if="musicUrl">
            <div class="current_name">
                <el-text type="primary">正在播放 {{ currentMusicName }}</el-text>
            </div>
            <audio controls autoplay :src="musicUrl">
            </audio>
        </div>
    </div>
    <GoAccountView v-else>
    </GoAccountView>

</template>
<script setup>
import { ref, watchEffect } from 'vue'
import { Search } from '@element-plus/icons-vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconStar from '@/components/icons/IconStar.vue'
import IconPrev from '@/components/icons/IconPrev.vue'
import IconNext from '@/components/icons/IconNext.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconListLoop from '@/components/icons/IconListLoop.vue'
import IconRandom from '@/components/icons/IconRandom.vue'
import IconSingleLoop from '@/components/icons/IconSingleLoop.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import Setting from '../components/Setting.js'
import GoAccountView from './GoAccountView.vue'
// const musicListTitle = ref([]);
const currentMusicListName = ref(Setting.getCache('currentMusicListName', '全部'));
//音乐列表样式
const musicListStyle = ref(Setting.getCache('musicListStyle', 'classic'));
// const { data, error } = useFetch('musiclist');
const { musicList, musicListTitle } = Setting.getMusicList();
const renderMusicList = ref({})
const renderMusicListTitle = ref([])
const playState = ref(1); // 0 播放中 1 暂停

const enableSearch = ref(false);
const searchMusicName = ref('');
const musicUrl = ref('');
const currentMusicName = ref('');
const loop = ref(Setting.getCache('loop', 0));// ['单曲循环', '全部循环', '随机播放']
const loopName = ref(['单曲循环', '全部循环', '随机播放']);
const loading = ref(false);
const options = ref([]);
const { miDeviceList, miDidList } = Setting.getMiDeviceList();
const currentDevice = ref('')
const volume = ref(0)
//手风琴音乐样式分页
const currentPage = ref(Setting.getCache('currentPage', 1,true));//当前页码
const pageSize = ref(Setting.getCache('pageSize', 6,true));//每页显示多少条
const total = ref(0);//列表总数
// const currentDevice = ref('');
try {
    currentDevice.value = toRaw(miDidList.value)[0]['did'];
} catch (e) {
}
Setting.getVolume(currentDevice.value, (vol) => {
    volume.value = vol
})
watch(currentDevice, () => {
    Setting.getVolume(currentDevice.value, (vol) => {
        volume.value = vol
    })
    // console.log('%csrc\views\PlayView.vue:125 currentDevice', 'color: #007acc;', currentDevice.value, volume.value);
})
watch(miDidList, () => {
    currentDevice.value = toRaw(miDidList.value)[0]['did'];
})

const handleSizeChange = (val) => {
    Setting.setCache('pageSize', val)
}
const handleCurrentChange = (val) => {
    Setting.setCache('currentPage', val)
}
const handleClassicalMusicList = () => {
    //只能存在预置的四个分类
    const presets = ['下载', '全部', '所有歌曲', '收藏'];
    const musicTitleList = musicListTitle.value;
    let music_list = {};
    musicTitleList.forEach((item) => {
        if (presets.includes(item)) {
            music_list[item] = musicList.value[item];
        }
    })
    renderMusicList.value = music_list;
    renderMusicListTitle.value = musicListTitle.value.filter((item) => presets.includes(item));
}
const handleAccordionMusicList = () => {
    //手风琴音乐列表需要分页

    console.log('%csrc\views\PlayView.vue:234 musicList.value', 'color: #007acc;', musicList.value);
    total.value = Object.keys(musicList.value).length
    console.log('%csrc\views\PlayView.vue:236 total', 'color: #007acc;', total);
    // renderMusicList.value = musicList.value;
    // renderMusicListTitle.value = musicListTitle.value;
    //根据currentPage和pageSize计算当前页的数据
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    // renderMusicList.value = musicList.value.slice(startIndex, endIndex)
    // renderMusicListTitle.value = musicListTitle.value.slice(startIndex, endIndex)
    //musicList是个对象 不能使用slice
    let music_list = {};
    for (let i = startIndex; i < endIndex; i++) {
        const key = musicListTitle.value[i];
        if (key) {
            music_list[key] = musicList.value[key];
        }
    }
    renderMusicList.value = music_list;
    renderMusicListTitle.value = musicListTitle.value.slice(startIndex, endIndex)
    console.log('%csrc\views\PlayView.vue:252 renderMusicListTitle', 'color: #007acc;', renderMusicListTitle.value);

}
watchEffect(() => {
    //renderMusicList跟当前musicListStyle样式有关
    if (!musicListStyle.value||!musicList.value) {
        return;
    }
    if (musicListStyle.value == 'classical') {
        handleClassicalMusicList();
        return;
    }
    if (musicListStyle.value == 'accordion' && musicList.value) {
        handleAccordionMusicList();
        return;

    }
    console.log('%csrc\views\PlayView.vue:179 musicListStyle.value', 'color: #007acc;', musicListStyle.value);
    console.log('%csrc\views\PlayView.vue:179 renderMusicList.value', 'color: #007acc;', renderMusicList.value);
})
const handleMusicList = (e) => {
    // console.log('%csrc\views\PlayView.vue:155 e', 'color: #007acc;', e);
    // console.log('%csrc\views\PlayView.vue:156 musicList', 'color: #007acc;', musicList.value);
    // console.log('%csrc\views\PlayView.vue:157 renderMusicList', 'color: #007acc;', renderMusicList.value);
    renderMusicList.value = musicList.value[e];
    currentMusicListName.value = e;
}

console.log('%csrc\views\PlayView.vue:59 miDeviceList,miDidList', 'color: #007acc;', miDeviceList, miDidList);


const changeVolume = () => {
    Setting.setVolume({
        did: currentDevice.value,
        volume: volume.value
    })
}

const handleRemotePlay = (e) => {
    //拼接形成参数 {"did":"568532341","cmd":"播放列表全部|嘉宾 - 张远"}
    // const config = {
    //     did: currentDevice.value,
    //     cmd: '播放列表' + currentMusicListName.value + '|' + e
    // }
    const config = {
        did: currentDevice.value,
        cmd: '播放歌曲' + e + '|'
    }
    playState.value = !playState.value
    // console.log('%csrc\views\PlayView.vue:66 e', 'color: #007acc;', e);
    Setting.sendCmd(config)
}
const handleRemotePlayAll = (e) => {
    // console.log('%csrc\views\PlayView.vue:115 e', 'color: #007acc;', e);
    playState.value = !playState.value
    Setting.sendCmd({
        did: currentDevice.value,
        cmd: '播放列表' + e + '|' + toRaw(musicList.value)[e][0]
    })
}
const handlePause = () => {
    //修改playstate
    playState.value = !playState.value
    //cmd 关机
    Setting.sendCmd({
        did: currentDevice.value,
        cmd: '关机'
    })
}
const handlePlay = (e) => {
    console.log('%csrc\views\PlayView.vue:119 e', 'color: #007acc;', e);
    const { musicInfo, error } = Setting.getMusicUrl(e);
    // console.log('%csrc\views\PlayView.vue:121 url', 'color: #007acc;', url);
    if (error.value) {
        ElMessage({
            message: error.value,
            type: 'error',
            duration: 1000
        })
        return;
    }
    playState.value = 1;
    watchEffect(() => {
        if (musicInfo.value) {
            currentMusicName.value = musicInfo.value.name;
            musicUrl.value = musicInfo.value.url;
        }
    })
}
const handleStar = () => {
    //只有currentMusicName 正在播放的音乐才能收藏
    if (!currentMusicName.value) {
        ElMessage({
            message: '只有正在播放的音乐才能收藏哦',
            type: 'error',
        })
        return;
    }
    const config = {
        did: currentDevice.value,
        cmd: '加入收藏'
    }
    // console.log('%csrc\views\PlayView.vue:66 e', 'color: #007acc;', e);
    Setting.sendCmd(config)
}
watchEffect(() => {
    musicUrl.value
})
const handleNext = () => {
    //cmd 
    const config = {
        did: currentDevice.value,
        cmd: '下一首'
    }
    Setting.sendCmd(config)
}
const handlePrev = () => {
    //cmd 
    const config = {
        did: currentDevice.value,
        cmd: '上一首'
    }
    Setting.sendCmd(config)
}
const handleLoop = (loopText) => {
    loop.value = (loop.value + 1) % 3;
    //延迟发送请求
    // console.log('%csrc\views\PlayView.vue:236 loopText', 'color: #007acc;', loopText);
    debounce(function () {
        const config = {
            did: currentDevice.value,
            cmd: loopText
        }
        Setting.sendCmd(config)
        Setting.setCache('loop', loop.value)
        // console.log('%csrc\views\PlayView.vue:243 cmd命令执行', 'color: #007acc;');
    }, 500)()
}
const musicSearch = (name) => {
    if (name == "") {
        return;
    }
    loading.value = true;
    let list = Setting.searchMusic(name);
    console.log('%csrc\views\PlayView.vue:119 list', 'color: #007acc;', list);
    watchEffect(() => {
        if (list) {
            loading.value = false;
            options.value = list.value;
        }
    })

}
const handleSearch = () => {
    playState.value = 0;
    //cmd
    Setting.sendCmd({
        did: currentDevice.value,
        cmd: '播放歌曲' + searchMusicName.value + '|'
    })
}
const handleDelete = (e, typename) => {
    //先确认再删除
    console.log('%csrc\views\PlayView.vue:247 musicList.value,typename', 'color: #007acc;', musicList.value, typename);
    ElMessageBox.confirm(
        '确认删除吗？',
        '警告'
    ).then(() => {
        Setting.delMusic(e)
        //遍历musicList 在musicList的所有属性中均删除
        Object.keys(musicList.value).forEach((key) => {
            musicList.value[key] = musicList.value[key].filter((item) => {
                return item != e
            })
        })
    })
}
const handleTabChange = (currentMusicListName) => {
    console.log('%csrc\views\PlayView.vue:287 currentMusicListName', 'color: #007acc;', currentMusicListName);
    Setting.setCache('currentMusicListName', currentMusicListName);
}
const debounce = (fn, delay = 500) => {
    // console.log('%csrc\views\PlayView.vue:288 ', 'color: #007acc;', '防抖执行了');
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
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
</style>