<template>
  <div class="converter-container">
    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <span>M3U 到 JSON 转换器</span>
        </div>
      </template>
      
      <el-form size="large">
        <el-form-item label="文件上传">
          <el-upload
            ref="upload"
            class="upload-demo"
            accept=".m3u"
            :show-file-list="false"
            :before-upload="handleFileUpload"
            :auto-upload="true"
          >
            <el-button type="primary">选择 M3U 文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="M3U 内容">
          <el-input
            v-model="m3uContent"
            type="textarea"
            :rows="6"
            placeholder="粘贴 M3U 内容或上传文件..."
            resize="both"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            class="convert-button"
            @click="convertToJSON"
            :loading="converting"
          >
            {{ converting ? '转换中...' : '转换' }}
          </el-button>
        </el-form-item>

        <el-form-item label="JSON 结果">
          <el-input
            v-model="jsonOutput"
            type="textarea"
            :rows="6"
            placeholder="转换后的 JSON 将显示在这里..."
            resize="both"
          ></el-input>
          <div class="result-actions">
            <el-button 
              type="default" 
              @click="copyToClipboard"
              :disabled="!jsonOutput"
            >
              复制结果
            </el-button>
            <el-button 
              type="default" 
              @click="downloadJSON"
              :disabled="!jsonOutput"
            >
              下载 JSON 文件
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 数据状态
const m3uContent = ref('');
const jsonOutput = ref('');
const converting = ref(false);
const upload = ref(null);

// 文件上传处理
const handleFileUpload = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    m3uContent.value = e.target.result;
    ElMessage.success('文件加载成功');
  };
  reader.onerror = () => {
    ElMessage.error('文件加载失败');
  };
  reader.readAsText(file);
  return false; // 阻止自动上传
};

// 转换 M3U 到 JSON
const convertToJSON = () => {
  if (!m3uContent.value.trim()) {
    ElMessage.warning('请输入或上传 M3U 内容');
    return;
  }

  converting.value = true;

  try {
    const lines = m3uContent.value.split('\n');
    const musicsArray = [];
    let currentName = '';

    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith('#EXTINF:')) {
        // 提取名称，支持处理扩展的 M3U 格式
        const nameMatch = line.match(/#EXTINF:.*,(.+)/);
        if (nameMatch && nameMatch[1]) {
          currentName = nameMatch[1];
        }
      } else if (line && line.startsWith('http') && currentName) {
        musicsArray.push({"name": currentName, "type": "radio", "url": line});
        currentName = ''; // 重置名称，准备下一个条目
      }
    });

    const output = [{
      "name": "m3u电台",
      "musics": musicsArray
    }];

    jsonOutput.value = JSON.stringify(output, null, 2);
    ElMessage.success(`成功转换 ${musicsArray.length} 个电台`);
  } catch (error) {
    ElMessage.error('转换失败：' + error.message);
    console.error('转换错误：', error);
  } finally {
    converting.value = false;
  }
};

// 复制结果到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.value);
    ElMessage.success('结果已复制到剪贴板');
  } catch (error) {
    ElMessage.error('复制失败，请手动复制');
    console.error('复制错误：', error);
  }
};

// 下载 JSON 文件
const downloadJSON = () => {
  const blob = new Blob([jsonOutput.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'm3u_converted.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  ElMessage.success('JSON 文件已下载');
};
</script>

<style scoped>
.converter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

.converter-card {
  width: 100%;
  max-width: 800px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.convert-button {
  width: 100%;
}

.result-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .converter-container {
    padding: 10px;
  }
  
  .converter-card {
    width: 100%;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .result-actions el-button {
    width: 100%;
  }
}
</style>