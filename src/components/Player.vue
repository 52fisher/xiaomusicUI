<template>
  <Teleport to="body">
    <div class="music_player_wrapper" :class="isMiniPlayer ? 'mini' : ' full '">
      <div class="music_player_box">
        <audio ref="audio" :src="currentTrack.url" @loadedmetadata="onLoadedMetadata" @timeupdate="updateCurrentTime"
          @ended="handleTrackEnd" autoplay></audio>
        <!-- 标题、收藏 -->


        <!-- 播放器控制部分 -->
        <div class="controls" ref="controls">
          <!-- 歌曲信息 -->
          <div class="music_info ">
            <div class="music_title wordMarquee">{{ currentTrack.name }}</div>
          </div>
          <!-- 歌曲进度条 -->
          <div class="progress_bar">
            <!-- <input type="range" :max="duration" :value="currentTime" @input="seek" step="0.1" /> -->
            <el-slider v-model="currentTime" @change="seek" :max="duration" :step="0.1"
              :disabled="currentDevice.did ? true : false" :show-tooltip="false" />
            <!-- 显示当前歌曲时间 -->
            <div class="time_display">
              <span class="current_time">{{ formatTime(currentTime) }}</span>
              <span class="slash">/</span>
              <span class="duration">{{ formatTime(duration) }}</span>
            </div>
          </div>
          <div class="controls_pannel">
            <!-- 播放模式选择 -->
            <div class="loop" @click="toggleLoopType">
              <IconRepeatOne v-if="loopType === 0" />
              <IconRepeatAll v-if="loopType === 1" />
              <IconRandom v-if="loopType === 2" />
            </div>
            <div class="prev">
              <IconMusicPrev @click="prevTrack" />
            </div>
            <div class="audio_state" @click="togglePlay">
              <img :src="currentTrack.cover" alt="" ref="audioState" class="cover">
              <div class="audio_state_icon">
                <IconMusicPause v-if="playState" />
                <IconMusicPlay v-else />
              </div>
            </div>
            <div class="next">
              <IconMusicNext @click="nextTrack" />
            </div>
          </div>

          <!-- 音量调整 -->
          <div class="volume">
            <!-- <input type="range" min="0" max="1" step="0.01" v-model="volume" @change="changeVolume" /> -->
            <el-slider v-model="volume" @change="changeVolume" :max="1" :min="0" :step="0.01" />
          </div>
          <!-- 收藏歌曲 -->
          <div class="music_star" v-if="currentDeviceDid !== '0'" @click="FavoriteSong">
            <IconStar />
          </div>
          <!-- 收缩列表 -->
          <div class="shrink">
            <!-- <IconShrink @click="isMiniPlayer = true" /> -->
            <IconToFullscreen @click="isMiniPlayer = false" v-if="isMiniPlayer" />
            <IconToWindow @click="isMiniPlayer = true" v-else />
          </div>
        </div>

      </div>
      <!-- 显示歌词 -->
      <div class="lyrics-container wordType" ref="lyricsContainer" v-show="!isMiniPlayer">
        <div class="lyrics_wrapper">
          <div class="lyrics" :style="{ top: lyricOffset }" v-if="currentLyric.length > 0">
            <div v-for="(line, index) in currentLyric" :key="index" :class="isCurrentLine(index) ? 'current' : ''">
              {{ line.text }}
            </div>
          </div>
          <div v-else class="lyrics_none">暂无歌词，请欣赏音乐吧</div>
        </div>
      </div>

      <!-- 封面 -->
      <!-- <div class="cover_wrapper" v-if="!isMiniPlayer">
        <img :src="currentTrack.cover" alt="" class="cover">
      </div> -->

    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSwipe, useStorage } from '@vueuse/core'
import IconMusicPlay from './icons/IconMusicPlay.vue'
import IconMusicPause from './icons/IconMusicPause.vue'
import IconMusicNext from './icons/IconMusicNext.vue'
import IconMusicPrev from './icons/IconMusicPrev.vue'
import IconRepeatAll from './icons/IconRepeatAll.vue'
import IconRepeatOne from './icons/IconRepeatOne.vue'
import IconRandom from './icons/IconRandom.vue'
import IconToFullscreen from './icons/IconToFullscreen.vue'
import IconToWindow from './icons/IconToWindow.vue'
import IconStar from './icons/IconStar.vue'

import api from './ApiList'
import fetchData from './fetchData';
const emit = defineEmits(['prev-track',
  'next-track',
  'random-track',
  'handle-play',
  'updateCurrentTrack',
  'no-scroll',
])
const playState = ref(false); //true为播放 显示暂停按钮，false为暂停 显示为播放按钮
const volume = useStorage('volume', 0.5);
// const loopType = ref('sequence');
const currentTime = ref(0);
const duration = ref(0); // 歌曲总时长
const audio = ref()
const audioState = ref(null) // 封面播放组件

//循环播放
const loopType = useStorage('loopType', 0);
const loopList = ['单曲循环', '全部循环', '随机播放'];

// 相对位置偏移量，根据高度调整偏移，使得当前歌词一定在所有歌词的中间
const lyricOffsetY = ref('calc( var(--lyh) * 2 )');
// 滚动偏移量
const lyricOffset = ref(lyricOffsetY.value);
// 滚动歌词容器的引用
const lyricsContainer = ref(null);

//当前歌曲的信息
const props = defineProps({
  currentTrack: {
    type: Object
  }
})
const currentTrack = computed(() => props.currentTrack);
//投放设备
// const devices = useStorage('devices', []);
const devicesSwitch = ref(false)
const miEnabledDevices = useStorage('miEnabledDevices', []);
const currentDevice = useStorage('currentDevice', { name: "本机", did: "0", play_type: 0 });//当前设备

const currentDeviceDid = useStorage('currentDeviceDid', "0");
const currentDeviceName = computed(() => {
  // return currentDeviceDid.value=="0" ? "本机":
  if (currentDeviceDid.value == "0") {
    return "本机"
  }
  return miEnabledDevices.value.find((item) => item.did == currentDeviceDid.value)?.name
})
// console.log('%csrc\components\player.vue:155 currentDeviceName.value', 'color: #007acc;', currentDeviceName.value);
//全局计时器id
const synctimer = ref(null)

//音乐组件是否最小化,通过isMiniPlayer来控制,controls是监控的组件，通过上滑和下滑来控制isMiniPlayer
const isMiniPlayer = ref(true);
const controls = ref(null)
// const { isSwiping, direction } = useSwipe(controls);

/**
 * 切换循环模式
 * @returns {void}
 */
const toggleLoopType = () => {
  //切换循环模式
  loopType.value = (loopType.value + 1) % loopList.length;
  //如果currentDevice的did不为空，则需要发送cmd请求，更改循环模式
  if (currentDeviceDid.value !== "0") {
    fetchData(api.sendCmd, {
      did: currentDeviceDid.value,
      cmd: loopList[loopType.value]
    }, (res) => {
      //如果返回结果ret为OK，则显示msg
      //用ElMessage
      res.ret == "OK" && ElMessage({
        message: currentDeviceName.value + ' 已切换为 ' + loopList[loopType.value],
        type: 'success',
      })
    })
  }
}

/**
 * @description: 切换设备
 * @param {Object} item 选择的设备
 * @return {void}
 */
const changeDevice = (item) => {
  //更换设备应该立即暂停音乐
  console.log('%csrc\components\Player.vue:169 playState.value', 'color: #007acc;', playState.value);
  // if (playState.value !== true) {
  //   audio.value.pause()
  // }
  //如果设备的did不为空，说明是本地 应该暂停音乐
  if (!currentDeviceDid.value) {
    audio.value?.pause()
    playState.value = false
  }
  devicesSwitch.value = false
  currentDevice.value = item
  if (!item.did) {
    //切换设备后如果是设备选择为本地，应该重新拉取音乐信息（remote的url为空）,注意清除定时器
    synctimer.value && clearInterval(synctimer.value)
    emit('updateCurrentTrack', currentTrack.value.name)
  }
  //同步歌曲信息
  //若更改的设备不是本地(did为空)，则要立即通过api拉取音量
  if (item.did) {
    //切换设备后获取正在播放的歌曲信息
    fetchData(api.getVolume + item.did, '', (res) => {
      volume.value = parseInt(res.volume) / 100;
    })
    //循环模式也要切换为当前设备的循环模式
    loopType.value = item.play_type
    //同时要开启同步歌曲信息的定时器，本地播放音乐不需要重复发起请求
    synctimer.value && clearInterval(synctimer.value)
    syncRemoteMusicInfo()
    synctimer.value = setInterval(syncRemoteMusicInfo, 1000)
  }
  localStorage.setItem('currentDevice', JSON.stringify(toRaw(item)))
  emit('change-device', item)
}

/**
 * 投放到小爱设备的音乐需要立即更新进度条
 * 同步歌词和进度条，首次立即执行，每隔1秒检测一次
 * @returns {void}
 */
const syncRemoteMusicInfo = () => {
  if (!currentDeviceDid.value) {
    return;
  }
  fetchData(api.playingMusic + currentDeviceDid.value, '', (res) => {
    if (res.ret != "OK") {
      throw new Error("获取播放信息失败");
    }
    // 如果歌曲名和res.cur_music不同，则立即获取歌曲信息
    if (res.cur_music && (currentTrack.value.name != res.cur_music)) {
      emit('updateCurrentTrack', res.cur_music, true)
    }
    // 如果正在播放，则同步歌词和进度
    if (res.is_playing) {
      // 图标也要同步
      playState.value = true
      // 同步远程信息，开启定时器
      duration.value = res.duration
      currentTime.value = res.offset
      updateLyricOffset();
      return;
    }
    // 没有播放就清空定时器并暂停播放
    synctimer.value && clearInterval(synctimer.value)
    playState.value = false
  })
}

//监听currentTrack的变化，更新播放组件的封面
watch(() => currentTrack.value.cover, (value) => {
  console.log('%csrc\components\Player.vue:259 cover发生变化了', 'color: #007acc;', value);
  audioState.value.src = value
})
// 监听音频元数据加载完成
const onLoadedMetadata = (event) => {
  // const audio = event.target;
  // console.log('%csrc\components\Player.vue:80 event', 'color: #007acc;', event);
  duration.value = event.target.duration;
  try {
    audio.value?.play().then(() => {
      audioState.value.src = currentTrack.value.cover;
      lyricsContainer.value && (lyricsContainer.value.style.backgroundImage = `url(${currentTrack.value.cover})`); // 更新歌词背景图
      playState.value = true;
    })

  } catch (err) {
    console.warn('%csrc\components\Player.vue:116 err,playState', 'color: #007acc;', err, playState);
    playState.value = false;
  }

};
/**
 * togglePlay
 * @description: 点击播放暂停按钮，切换播放状态
 * @return {void}
 */
const togglePlay = () => {
  console.log('%csrc\components\Player.vue:275 playState.value', 'color: #007acc;', playState.value);
  // 本地播放直接操作playState即可
  if (currentDeviceDid.value == "0") {
    // play()和pause()已经通过watch绑定到playState.value上了直接切换即可
    playState.value = !playState.value;
    return;
  }

  // 如果currentDevice的did不为空，则应该在小爱设备上进行播放
  // 若当前为播放状态，点击按钮后切换为暂停状态
  if (playState.value === true) {

    fetchData(api.sendCmd, {
      did: currentDeviceDid.value,
      cmd: '关机'
    }, () => {
      //暂停后应该停止定时器
      synctimer.value && clearInterval(synctimer.value)
      playState.value = false;
      ElMessage({
        message: '已发送 关机 指令给 ' + currentDeviceName.value,
        type: 'success',
      })
    })

    return;
  }

  // remote设备的暂停其实是关机命令，所以playState.value为false时要重新播放
  emit('handle-play', currentTrack.value.name)

  playState.value = true;
};
// 上一首
const prevTrack = async () => {
  currentDeviceDid.value == "0" && (playState.value = false); // 切换前先暂停
  if (loopType.value === 2) {
    emit('random-track');
    return;
  }
  emit('prev-track');
  // currentTrackIndex.value = (currentTrackIndex.value - 1 + playerList.value.length) % playerList.value.length;
  // await playCurrentTrack(); // 切换后自动播放
};
// 下一首
const nextTrack = async () => {
  currentDeviceDid.value == "0" && (playState.value = false); // 切换前先暂停
  //loopType如果为2，则表示随机播放,抛出随机random-track
  if (loopType.value === 2) {
    emit('random-track');
    return;
  }
  emit('next-track');
  // currentTrackIndex.value = (currentTrackIndex.value + 1) % playerList.value.length;
  // await playCurrentTrack(); // 切换后自动播放
};

// 播放当前音乐
const playCurrentTrack = async () => {
  playState.value = true;
  await audio.value.load(); // 确保加载完毕
  // 尝试播放
  await audio.value.play()

};
// 监听当前歌曲的播放进度
const updateCurrentTime = (event) => {
  currentTime.value = event.target.currentTime;
  updateLyricOffset(); // 根据播放进度更新歌词滚动
};
// 调节音量
const changeVolume = () => {
  audio.value.volume = volume.value;
  if (currentDeviceDid.value !== "0") {
    //用fetchData改写
    fetchData(api.setVolume, {
      did: currentDeviceDid.value,
      volume: parseInt(volume.value * 100)// 小爱设备音量范围是0-100，本地音量范围是0-1
    })
  }
  //保存到本地
  localStorage.setItem('volume', volume.value);
};
/**
 * FavoriteSong
 * @description: Collect the current song
 * @returns {void}
 */
const FavoriteSong = () => {
  // sendcmd to inform the backend to collect the current song
  fetchData(api.sendCmd, {
    did: currentDeviceDid.value,
    cmd: '收藏歌曲' // collect song
  }, (res) => {
    res.ret == "OK" && ElMessage({
      message: "已收藏 " + currentTrack.value.name,
      type: 'success',
    })
  })
}
// 监听歌曲播放结束
const handleTrackEnd = () => {
  //单曲循环直接再次调用playCurrentTrack,并把歌词的offset归零
  lyricOffset.value = 0;
  if (loopType.value === 0) {
    playCurrentTrack();
    return;
  }
  // 列表循环
  nextTrack();

};
// 调节播放进度
const seek = () => {
  //remote的音乐无法选择播放进度
  if (currentDeviceDid.value !== "0") {
    ElMessage({
      message: "远程设备无法选择播放进度",
      type: 'error',
    })
    return;
  }
  audio.value.currentTime = parseFloat(currentTime.value); // 跳转到新的播放位置
};
// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`; // 格式化为分:秒
};

// 解析歌词
const currentLyric = computed(() => {
  // const obj = currentTrack.value;
  return currentTrack.value.lyric ? parseLyrics(currentTrack.value.lyric) : [];
});

// 解析歌词并生成带有时间戳和内容的列表
const parseLyrics = (lyric) => {
  const lines = lyric.split('\n');
  const parsed = lines.map((line) => {
    const match = line.match(/\[(\d+):(\d+\.\d+)\] ?(.*)/); // 只需匹配文本部分
    if (match) {
      const [, mins, secs, text] = match;
      return {
        time: parseFloat(mins) * 60 + parseFloat(secs),
        text: text.trim(), // 确保去掉多余的空格
      };
    }
    return null; // 没有匹配成功的行返回 null
  }).filter((item) => item && item.text.length > 0); // 过滤掉空行或没有文本的行
  return parsed;
};

// 更新歌词偏移，确保当前歌词在视野中
const updateLyricOffset = () => {
  const currentLyricIndex = currentLyric.value.findIndex((line) => line.time > currentTime.value);
  // 防止歌曲结束后偏移量重置
  if (currentTime.value <= duration.value) {
    if (currentLyricIndex > 0) {
      //每一行高度不固定，要根据元素的实际高度来计算
      lyricOffset.value = `calc( ( ${currentLyricIndex - 1} * -1 ) * var(--lh) + ${lyricOffsetY.value} )`;
      // lyricOffset.value = (currentLyricIndex - 1) * 18 + 10; // 30px 代表每行歌词的高度
      // console.log('%csrc\components\Player.vue:236 (currentLyricIndex - 1)  * 18 + 10 ', 'color: #007acc;', (currentLyricIndex - 1) * 18 + 10);
    }
  } else {
    // 如果歌曲结束，保持在最后一行
    lyricOffset.value = `calc( ${currentLyric.value.length - 1} * -1 * var(--lh) + ${lyricOffsetY.value} )`;
  }
};

/**
 * 判断当前行是否为当前时间对应的歌词行
 * @param {number} index - 歌词行的索引
 * @returns {boolean} - 是否是当前时间对应的歌词行
 */
const isCurrentLine = (index) => {
  // 找到当前时间对应的歌词行
  const nextIndex = currentLyric.value.findIndex((line) => line.time > currentTime.value);

  // 如果当前时间小于歌曲总时长
  if (currentTime.value <= duration.value) {
    // 如果找到当前时间对应的歌词行
    if (nextIndex > 0) {
      // 则当前行是当前时间对应的歌词行
      return index === nextIndex - 1;
    } else {
      // 如果当前时间大于 0
      if (currentTime.value > 0) {
        // 则当前行是最后一行
        return index === currentLyric.value.length - 1;
      }
    }
  }
};
//使用autoplay时playState变得不可靠，自动更新状态存在问题，必须在挂载完成后,监听audio的播放状态,修正状态
onMounted(() => {
  // If the current device is a remote device, start the timer
  if (currentDeviceDid.value !== "0") {
    syncRemoteMusicInfo()
    // Set the timer to sync the music info every second
    synctimer.value = setInterval(syncRemoteMusicInfo, 1000)
  }
  audio.value.addEventListener('playing', () => {
    playState.value = true;
    audioState?.value?.classList.add('rotate')
  })
  audio.value.addEventListener('pause', () => {
    playState.value = false;
    audioState?.value?.classList.remove('rotate')
  })
  audio.value.onerror = () => {
    // console.log('%csrc\components\Player.vue:12 remote的音乐不能加载正确的src，src会报错', 'color: #007acc;');
    //报错是因为remote的音乐不能也不需要加载src，因为这样会造成本地开始播放，忽略即可
  }
})
watch(() => playState.value, (value) => {
  if (value) {
    audioState?.value?.classList.add('rotate')
    // console.log('%csrc\components\Player.vue:465 audio.value', 'color: #007acc;', audio.value);
    currentDeviceDid.value == "0" && audio.value?.play();
    return;
  }
  audioState.value?.classList.remove('rotate')

  currentDeviceDid.value == "0" && audio.value?.pause();
})
//控制栏最大化时将封面传给歌词容器
watch(isMiniPlayer, (value) => {
  const body = document.querySelector("body").classList;
  //最大化时
  if (!value) {
    body.add("no-scroll")
    lyricsContainer.value && (lyricsContainer.value.style.backgroundImage = `url(${currentTrack.value.cover})`);
    return;
  }
  //最小化时
  body.remove("no-scroll")
})

</script>

<style scoped lang="scss">
//导入字体

@font-face {
  font-family: 'AliFY';
  src: url('@/assets/AlimamaFangYuanTiVF-Thin.woff2');
  font-weight: normal;
  font-style: normal
}

.wordType {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.wordMarquee {
  white-space: nowrap;
  word-break: keep-all;
}

.music_player_wrapper {
  display: flex;
  flex-direction: column-reverse;
  background-color: var(--el-bg-color);
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  z-index: 99;
  position: -webkit-sticky;
  position: absolute;
  color: var(--el-text-color-primary);
  width: 100vw;
  --lh: 40px;
  --fz: 20px;

  .music_player_box {
    width: 100vw;
    display: flex;
    --size: 80px;
    box-shadow: 8px 0px 5px 0px rgba(0, 0, 0, 0.1);
    height: 100px;
    justify-content: space-evenly;
  }

  .music_info {
    font-size: calc(var(--fz) * 0.8);
    display: flex;
    align-items: center;
    width: 12vw;
    overflow: hidden;

    .music_title {
      display: flex;
      font-weight: bold;
      justify-content: space-between;
      animation: marquee 10s linear infinite;

      svg {
        width: 6vw;
        height: 6vw;

      }
    }
  }


  .controls {
    display: flex;
    gap: 2vw;

    .controls_pannel {
      display: flex;
      gap: 4vw;
      width: 30vw;
      align-items: center;
      justify-content: center;
    }

    .prev,
    .next,
    .audio_state,
    .loop,
    .shrink,
    .music_star {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .progress_bar {
    display: flex;
    justify-content: left;
    // align-content: center;
    width: 30vw;
    align-items: center;

    .time_display {
      display: flex;
      justify-content: space-between;
      // margin: 0 auto;
      margin-left: 10px;

      .slash {
        margin: 0 5px;
      }
    }
  }

  .audio_state {
    position: relative;

    .cover {
      width: var(--size);
      height: var(--size);
      background-size: var(--size) var(--size);
      border-radius: var(--size);
      position: absolute;
    }

    .audio_state_icon {
      display: flex;
      align-items: center;
      padding: .5rem;
      opacity: .8;
      background: #f0f0f0;
      border-radius: var(--size);
      width: calc(var(--size) * 0.4);
      height: calc(var(--size) * 0.4);
      justify-content: center;
    }

    svg {
      position: absolute;
      z-index: 99;
      color: #2c2c2c;
    }
  }

  .lyrics-container {
    flex: 1;
    height: 500px;
    overflow-y: auto;
    position: relative;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 4.333vw;
    line-height: var(--lh);
    font-weight: normal;
    height: 300px;
    overflow: hidden;
    font-size: var(--fz);
    font-family: "AliFY", "AliDFKai", "宋体", "黑体";
    background-repeat: no-repeat;
    background-size: cover;
    -moz-background-size: cover;
  }

  .lyrics-container:active {
    cursor: grab;
  }

  .lyrics_wrapper {
    backdrop-filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.8);
    height: 100%;
    align-content: center;
  }

  .lyrics {
    position: absolute;
    transition: top 0.3s linear;
    backdrop-filter: blur(5px);
  }

  .lyrics>div {
    text-align: center;
    width: 96vw;
    padding: 0 2vw;
    filter: blur(1px);
  }

  .lyrics_none {
    display: flex;
    justify-content: center;
  }

  .current {
    color: red;
    font-weight: bold;
    font-size: calc(var(--fz) * 1.2);
    filter: none!important;
  }


  .volume {
    width: 10vw;
    display: flex;
    align-items: center;
  }
}

.mini {
  flex-direction: row;

}

.full {
  top: 0;
  overflow: hidden;

  .lyrics-container {
    --lyh: 20vh;
    position: relative;
    height: var(--lyh);
    overflow: hidden;
  }

  .controls {
    display: flex;

    .loop svg,
    .shrink svg {
      fill: #a2a9af;
    }
  }


}

.rotate {
  animation: coverRotate 5s linear infinite;
}

@keyframes coverRotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}

@media (prefers-color-scheme: dark) {
  .music_player_wrapper {
    .controls {

      .prev svg,
      .next svg {
        fill: var(--el-text-color-primary);
      }
    }
  }

}
</style>