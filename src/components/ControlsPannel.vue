<template>
    <div class="control_pannel">
        <el-button circle>
            <el-icon v-if="playState" title="在小爱设备上播放" @click="handleRemotePlayAll()">
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
</template>
<script setup>
import IconPlay from '@/components/icons/IconPlay.vue'
import IconStar from '@/components/icons/IconStar.vue'
import IconPrev from '@/components/icons/IconPrev.vue'
import IconNext from '@/components/icons/IconNext.vue'
import IconPause from '@/components/icons/IconPause.vue'
import IconListLoop from '@/components/icons/IconListLoop.vue'
import IconRandom from '@/components/icons/IconRandom.vue'
import IconSingleLoop from '@/components/icons/IconSingleLoop.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import { useStorage } from '@vueuse/core'
const loop = useStorage('loop', 0);// ['单曲循环', '全部循环', '随机播放']
const loopName = ref(['单曲循环', '全部循环', '随机播放']);
const volume = useStorage('volume', 0.3);//音量

const playState = ref(false)
defineEmits(['handleRemotePlayAll', 'handlePlay', 'handlePause', 'handleStar', 'handleNext', 'handlePrev', 'handleLoop', 'changeVolume'])
</script>