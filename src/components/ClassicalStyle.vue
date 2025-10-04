<template>
    <div class="musiclist_wraper">
        <el-tabs v-model="currentMusicListName" type="card" class="tabs" v-if="musicList" :stretch="true">
            <template v-for="(item, index) in renderMusicTitleList" :key="index">
                <el-tab-pane :label="item" :name="item">
                    <el-scrollbar height="56vh">
                        <ul 
                            class="musiclist" 
                            v-infinite-scroll="() => loadMore(item)" 
                            :infinite-scroll-disabled="isListFullyLoaded(item)"
                            infinite-scroll-distance="50"
                        >
                            <template v-for="(v, i) in renderMusicList[item]" :key="i">
                                <li @dblclick="handlePlay(v)">
                                    <div class="song_info"><el-text>{{ v }}</el-text></div>
                                    <div class="song_opts">
                                        <el-icon @click="handlePlay(v)" title="播放">
                                            <IconPlay />
                                        </el-icon>
                                        <el-icon @click.stop="handleDelete(v, item)" title="删除该歌曲" v-if="showDelBtn">
                                            <IconDelete />
                                        </el-icon>
                                    </div>
                                </li>
                            </template>
                            <li v-if="!isListFullyLoaded(item)" class="loading">加载中...</li>
                        </ul>
                    </el-scrollbar>
                </el-tab-pane>
            </template>
        </el-tabs>
    </div>
</template>
<script setup>
import useMusicList from './useMusicList';
import IconDelete from './icons/IconDelete.vue';
import { ElMessage } from 'element-plus';
import { useStorage } from '@vueuse/core';
const emit = defineEmits(['handle-play', 'handle-delete']);

const showDelBtn = useStorage('showDelBtn', false);
const { musicTitleList, musicList } = useMusicList();
const currentMusicListName = useStorage('currentMusicListName', '全部');
currentMusicListName.value == "" && (currentMusicListName.value = "全部");

// 每个分类的加载数量状态
const categoryLoadSizes = ref({});
// 每批加载的歌曲数量
const batchSize = 50;

// 预设显示的分类
const presets = ['下载', '全部', '所有歌曲', '收藏'];
const renderMusicTitleList = computed(() => {
    return musicTitleList.value.filter((item) => presets.includes(item))
})

// 渲染的音乐列表，按需加载每个分类下的歌曲
const renderMusicList = computed(() => {
    const result = {};
    const currentCategory = currentMusicListName.value;
    
    // 只处理当前选中的分类，避免不必要的计算
    if (currentCategory && musicList.value[currentCategory]) {
        // 获取该分类当前应加载的数量
        const loadSize = categoryLoadSizes.value[currentCategory] || batchSize;
        // 只加载指定数量的歌曲
        result[currentCategory] = musicList.value[currentCategory].slice(0, loadSize);
    }
    
    return result;
})

// 加载更多歌曲
const loadMore = (category) => {
    if (isListFullyLoaded(category)) return;
    
    // 更新该分类的加载数量
    const currentSize = categoryLoadSizes.value[category] || batchSize;
    const totalItems = musicList.value[category]?.length || 0;
    const newSize = Math.min(currentSize + batchSize, totalItems);
    
    categoryLoadSizes.value[category] = newSize;
    
    // 如果已经加载了所有歌曲，显示提示
    if (newSize >= totalItems) {
        ElMessage({ message: `已加载完${category}分类的所有歌曲`, type: 'info', duration: 1500 });
    }
}

// 检查列表是否已完全加载
const isListFullyLoaded = (category) => {
    const loadSize = categoryLoadSizes.value[category] || batchSize;
    const totalItems = musicList.value[category]?.length || 0;
    return loadSize >= totalItems;
}

// 切换分类时重置该分类的加载状态
watch(currentMusicListName, (newCategory) => {
    // 只在初次访问分类时设置初始加载量
    if (!categoryLoadSizes.value[newCategory]) {
        categoryLoadSizes.value[newCategory] = batchSize;
    }
})

// 处理播放事件
const handlePlay = (v) => {
    emit('handle-play', v);
}

// 处理删除事件
const handleDelete = (v, item) => {
    emit('handle-delete', v, item);
}
</script>
<style scoped>
.musiclist_wraper {
    display: flex;
    align-items: start;
    position: relative;
    width: 50vw;
    padding: 10px 0;
}

.tabs {
    width: 100%;
    min-height: 480px;
}

.musiclist {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.musiclist li {
    cursor: pointer;
    height: 38px;
    padding: 10px;
    display: flex;
    justify-content: left;
    align-items: center;
    transition: all 0.2s ease;
}

.musiclist li:hover {
    text-decoration: none;
    background-color: #EEE;
}

.song_info {
    width: 70%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.song_opts {
    width: 16%;
    margin: auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.loading {
    text-align: center;
    color: #999;
    font-size: 14px;
    padding: 10px;
    height: auto;
}

/* 媒体查询，宽度小于1200px时调整样式 */
@media screen and (max-width: 1200px) {
    .musiclist_wraper {
        width: 100%;
    }
    
    .musiclist {
        width: 300px;
    }
}
</style>