<template>
    <div class="musiclist_wraper" v-if="musicList">
        <el-scrollbar height="56vh">
            <el-collapse v-model="currentMusicListName" accordion>
                <template v-for="(item, index) in renderMusicTitleList" :key="index">
                    <el-collapse-item :title="item" :name="item">
                        <ul class="musiclist" v-infinite-scroll="() => loadMore(item)" :infinite-scroll-disabled="isListFullyLoaded(item)">
                            <template v-for="(v, i) in renderMusicList[item]" :key="i">
                                <li @dblclick="handlePlay(v)">
                                    <div class="song_info"><el-text>{{ v }}</el-text></div>
                                    <div class="song_opts">
                                        <el-icon @click="handlePlay(v)">
                                            <IconPlay />
                                        </el-icon>
                                        <el-icon @click.stop="handleDelete(v, item)" v-if="showDelBtn">
                                            <IconDelete />
                                        </el-icon>
                                    </div>
                                </li>
                            </template>
                            <li v-if="!isListFullyLoaded(item)" class="loading">加载中...</li>
                        </ul>
                    </el-collapse-item>
                </template>
            </el-collapse>
        </el-scrollbar>
    </div>
    <div class="pagination-block" v-if="musicList">
        <el-pagination 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total" 
            v-model:current-page="currentPage" 
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStorage } from '@vueuse/core';
import IconDelete from './icons/IconDelete.vue';
import useMusicList from './useMusicList';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['handle-play', 'handle-delete'])
const { musicTitleList, musicList } = useMusicList();
const currentPage = useStorage('currentPage', 1)
const pageSize = useStorage('pageSize', 20)
const currentMusicListName = useStorage('currentMusicListName', '全部');
const showDelBtn = useStorage('showDelBtn', false);

// 每个分类的加载数量状态
const categoryLoadSizes = ref({});
// 每批加载的歌曲数量
const batchSize = 50;

// 根据currentPage和pageSize计算当前页的分类数据
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => startIndex.value + pageSize.value);

// 渲染的分类列表
const renderMusicTitleList = computed(() => {
    return musicTitleList.value.slice(startIndex.value, endIndex.value)
})

// 计算总分类数
const total = computed(() => {
    return Object.keys(musicList.value).length
})

// 渲染的音乐列表，按需加载每个分类下的歌曲
// 修复：添加当前展开分类的加载状态管理
const expandedCategories = ref(new Set());

// 修复：监听分类展开/折叠状态变化
watch(currentMusicListName, (newCategory, oldCategory) => {
    if (oldCategory && oldCategory !== newCategory) {
        // 移除旧分类的展开状态
        expandedCategories.value.delete(oldCategory);
    }
    if (newCategory) {
        // 添加新分类的展开状态
        expandedCategories.value.add(newCategory);
        // 确保展开的分类有加载状态
        if (!categoryLoadSizes.value[newCategory]) {
            categoryLoadSizes.value[newCategory] = batchSize;
        }
    }
});

// 修复：优化渲染的音乐列表，只加载当前展开分类的歌曲
const renderMusicList = computed(() => {
    let music_list = {};
    
    for (let i = startIndex.value; i < endIndex.value; i++) {
        const key = musicTitleList.value[i];
        if (key && musicList.value[key]) {
            // 只加载当前展开分类的歌曲
            if (expandedCategories.value.has(key)) {
                const loadSize = categoryLoadSizes.value[key] || batchSize;
                music_list[key] = musicList.value[key].slice(0, loadSize);
            } else {
                // 未展开的分类只加载少量歌曲或不加载，减少性能消耗
                music_list[key] = musicList.value[key].slice(0, 1);
            }
        }
    }
    
    return music_list;
});

// 修复：在mounted钩子中初始化展开状态
onMounted(() => {
    // 初始化当前选中分类的展开状态
    if (currentMusicListName.value) {
        expandedCategories.value.add(currentMusicListName.value);
        if (!categoryLoadSizes.value[currentMusicListName.value]) {
            categoryLoadSizes.value[currentMusicListName.value] = batchSize;
        }
    }
});

// 加载更多歌曲
// 修复：优化加载更多函数，添加节流控制
let loadingTimeout = null;
const loadMore = (category) => {
    if (isListFullyLoaded(category)) return;
    
    // 节流控制，避免短时间内多次触发
    if (loadingTimeout) return;
    
    loadingTimeout = setTimeout(() => {
        const currentSize = categoryLoadSizes.value[category] || batchSize;
        const totalItems = musicList.value[category]?.length || 0;
        const newSize = Math.min(currentSize + batchSize, totalItems);
        
        categoryLoadSizes.value[category] = newSize;
        
        if (newSize >= totalItems) {
            ElMessage({ message: `已加载完${category}分类的所有歌曲`, type: 'info', duration: 1500 });
        }
        
        loadingTimeout = null;
    }, 200);
}

// 检查列表是否已完全加载
const isListFullyLoaded = (category) => {
    const loadSize = categoryLoadSizes.value[category] || batchSize;
    const totalItems = musicList.value[category]?.length || 0;
    return loadSize >= totalItems;
}

// 重置当前页面时，也重置加载状态
const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    resetLoadSizes();
}

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    resetLoadSizes();
}

// 重置所有分类的加载状态
const resetLoadSizes = () => {
    categoryLoadSizes.value = {};
}

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
}

.musiclist li:hover {
    text-decoration: none;
    background-color: #EEE;
}

.song_info {
    width: 70%;
    display: block;
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
}

.pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}
</style>