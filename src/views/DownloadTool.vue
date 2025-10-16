<template>
  <div class="download-tool-container">
    <h1>歌曲下载工具</h1>
    
    <el-card class="download-card">
      <template #header>
        <div class="card-header">
          <span>歌单下载</span>
        </div>
      </template>
      
      <el-form ref="playlistForm" :model="playlistFormData" class="download-form">
        <el-form-item label="歌单 URL" prop="playlistUrl" required>
          <el-input
            v-model="playlistFormData.playlistUrl"
            placeholder="请输入歌单URL"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="歌单名字" prop="dirname" required>
          <el-input
            v-model="playlistFormData.dirname"
            placeholder="请输入歌单名字"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="downloadPlaylist"
            :loading="loadingStates.playlist"
          >
            {{ loadingStates.playlist ? '下载中...' : '下载歌单' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-divider />
    
    <el-card class="download-card">
      <template #header>
        <div class="card-header">
          <span>单曲下载</span>
        </div>
      </template>
      
      <el-form ref="songForm" :model="songFormData" class="download-form">
        <el-form-item label="歌曲 URL" prop="songUrl" required>
          <el-input
            v-model="songFormData.songUrl"
            placeholder="请输入歌曲URL"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="歌曲名字" prop="songName" required>
          <el-input
            v-model="songFormData.songName"
            placeholder="请输入歌曲名字"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="downloadSong"
            :loading="loadingStates.song"
          >
            {{ loadingStates.song ? '下载中...' : '下载单曲' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 歌单表单数据
const playlistFormData = reactive({
  playlistUrl: 'https://m.bilibili.com/video/BV1WUsDezE88',
  dirname: ''
});

// 单曲表单数据
const songFormData = reactive({
  songUrl: 'https://m.bilibili.com/video/BV1qD4y1U7fs',
  songName: ''
});

// 加载状态
const loadingStates = reactive({
  playlist: false,
  song: false
});

// 使用fetch API发送请求的通用函数
const sendRequest = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
};

// 歌单下载
const downloadPlaylist = async () => {
  if (!playlistFormData.playlistUrl || !playlistFormData.dirname) {
    ElMessage.error('请填写完整的歌单 URL 和歌单名字');
    return;
  }

  loadingStates.playlist = true;
  
  try {
    const response = await sendRequest('/downloadplaylist', {
      dirname: playlistFormData.dirname,
      url: playlistFormData.playlistUrl
    });
    
    ElMessage.success('歌单下载请求已发送!');
    console.log(response);
  } catch (error) {
    ElMessage.error('歌单下载请求失败，请重试。');
  } finally {
    loadingStates.playlist = false;
  }
};

// 单曲下载
const downloadSong = async () => {
  if (!songFormData.songUrl || !songFormData.songName) {
    ElMessage.error('请填写完整的歌曲 URL 和歌曲名字');
    return;
  }

  loadingStates.song = true;
  
  try {
    const response = await sendRequest('/downloadonemusic', {
      name: songFormData.songName,
      url: songFormData.songUrl
    });
    
    ElMessage.success('单曲下载请求已发送!');
    console.log(response);
  } catch (error) {
    ElMessage.error('单曲下载请求失败，请重试。');
  } finally {
    loadingStates.song = false;
  }
};
</script>

<style scoped>
.download-tool-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.download-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.download-form {
  width: 100%;
}
</style>