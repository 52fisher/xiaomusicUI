<template>
    <div class="musiclist_wraper" v-if="musicList">
        <el-scrollbar height="56vh">
            <el-collapse v-model="currentMusicListName" accordion>
                <template v-for="(item, index) in renderMusicTitleList" :key="index">
                    <el-collapse-item :title="item" :name="item">
                        <ul class="musiclist">
                            <template v-for="(v, i) in renderMusicList[item]" :key="i">
                                <li>
                                    <div class="song_info"><el-text>{{ v }}</el-text></div>
                                    <div class="song_opts">
                                        <el-icon @click="$emit('handlePlay',v)">
                                            <IconPlay />
                                        </el-icon>
                                        <!-- <el-icon @click.stop="handleDelete(v, item)">
                                            <IconDelete />
                                        </el-icon> -->
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-scrollbar>

    </div>
    <div class="pagination-block" v-if="musicList">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[6, 10, 12, 15]"
         layout="total, sizes, prev, pager, next, jumper" :total="total" />
        <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange"  -->
    </div>
</template>
<script setup>
import { useStorage } from '@vueuse/core';

import useMusicList from './useMusicList';
defineEmits(['handlePlay'])
//所有的musicList都只截取前30首
const { musicTitleList, musicList } = useMusicList();
const currentPage = useStorage('currentPage', 1)
const pageSize = useStorage('pageSize', 6)
const currentMusicListName = useStorage('currentMusicListName', '全部');
// const list = useStorage('list',currentMusicListName? musicList.value[currentMusicListName.value]:musicList.value['全部'])

//根据currentPage和pageSize计算当前页的数据

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => startIndex.value + pageSize.value);
//musicList是个对象 不能使用slice
//每次加载的数量
// const loadSize = ref(30);//当前加载的数量
const renderMusicList = computed(() => {
    let music_list = {};
    for (let i = startIndex.value; i < endIndex.value; i++) {
        const key = musicTitleList.value[i];
        // music_list[key] = musicList.value[key].slice(0, loadSize.value);
        music_list[key] = musicList.value[key];
    }
    return music_list;
})

const renderMusicTitleList = computed(() => {
    return musicTitleList.value.slice(startIndex.value, endIndex.value)
})
// const disabled = computed(() => {
//     if (currentMusicListName.value) {
//         return renderMusicList.value[currentMusicListName.value].length >= musicList.value[currentMusicListName.value].length
//     }
//     return true;
// })
const total = computed(() => {
    return Object.keys(musicList.value).length
})
// const loadList = () => {
//     loading.value = true
//     loadSize.value += 30

// }
// const handleSizeChange = (val) => {
//     pageSize.value = val
// }
// const handleCurrentChange = (val) => {
//     currentPage.value = val
// }
const handleRemotePlay = (val) => {
    console.log('%csrc\views\PlayView.vue:155 val', 'color: #007acc;', val);
}
</script>