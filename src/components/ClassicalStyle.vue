<template>
    <div class="musiclist_wraper">
        <el-tabs v-model="currentMusicListName" type="card" class="tabs" v-if="musicList" :stretch="true">
            <template v-for="(item, index) in renderMusicTitleList" :key="index">
                <el-tab-pane :label="item" :name="item">
                    <el-scrollbar height="56vh">
                        <ul class="musiclist" v-infinite-scroll="loadList" :infinite-scroll-disabled="disabled">
                            <template v-for="(v, i) in renderMusicList[item]" :key="i">
                                <li @dblclick="$emit('handle-play', v)">
                                    <div class="song_info"><el-text>{{ v }}</el-text></div>
                                    <div class="song_opts">
                                        <el-icon @click="$emit('handle-play', v)" title="播放">
                                            <IconPlay />
                                        </el-icon>
                                        <el-icon @click.stop="$emit('handle-delete', v, item)" title="删除该歌曲" v-if="showDelBtn">
                                            <IconDelete />
                                        </el-icon>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </el-scrollbar>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>
<script setup>
import { useStorage } from '@vueuse/core';
import useMusicList from './useMusicList';
import IconDelete from './icons/IconDelete.vue';
// console.log('%csrc\components\ClassicalStyle.vue:43 musicList.value', 'color: #007acc;', props);
defineEmits(['handle-play', 'handle-delete']);

const showDelBtn = useStorage('showDelBtn', false);
const { musicTitleList, musicList } = useMusicList();
const currentMusicListName = useStorage('currentMusicListName', '全部');
currentMusicListName.value == "" && (currentMusicListName.value = "全部");

// console.log('%csrc\components\ClassicalStyle.vue:39 musicTitleList.value, musicList.value', 'color: #007acc;', musicTitleList.value, musicList.value);
// useStorage('list',musicList.value[currentMusicListName.value])


const presets = ['下载', '全部', '所有歌曲', '收藏'];
const renderMusicTitleList = computed(() => {
    return musicTitleList.value.filter((item) => presets.includes(item))
})
//所有的musicList都只截取前30首
const endIndex = ref(30);
let list = ref({});
// const renderMusicList = ref({});
const renderMusicList = computed(() => {
    const item = currentMusicListName.value;
    list.value[item] = musicList.value[item].slice(0, endIndex.value);
    return list.value;
})

const loadList = () => {
    const item = currentMusicListName.value;
    const clen = renderMusicList.value[item].length;
    // list[item]= musicList.value[item].slice(0,  clen + 30);
    // console.log('%csrc\components\ClassicalStyle.vue:65 clen', 'color: #007acc;', clen);
    endIndex.value = clen + 30
}
const disabled = computed(() => {
    return renderMusicList.value[currentMusicListName.value].length >= musicList.value[currentMusicListName.value].length
})
// console.log('%csrc\components\ClassicalStyle.vue:67 disabled.value', 'color: #007acc;', disabled.value);
const handlePlay = (v) => {
    console.log('%csrc\components\ClassicalStyle.vue:84 v', 'color: #007acc;', v);
    emit('handle-play', v);
}
</script>
