<template>
  <div class="container" v-if="!loading">
    <div class="nav">
      <NavMenu :miEnabledDevices="miEnabledDevices" />
    </div>
    <div class="content">
      <el-scrollbar height="90vh">
        <RouterView @updateSetting="updateSetting" />
      </el-scrollbar>
    </div>
  </div>
  <div class="loading_mask" v-loading.fullscreen.lock="loading" element-loading-text="正在缓存设置信息，请稍后"></div>
</template>
<script setup>

import { RouterView } from 'vue-router'
import NavMenu from './components/NavMenu.vue'

import useSetting from './components/useSetting';
import { useStorage, computedAsync } from '@vueuse/core';

// 全局账号信息
//获取设置信息，包含账号、设备等
const loading = ref(true);
//获取缓存设置信息，没有缓存则从服务器获取
const settingData = useSetting();
//检测是否有账号信息，如果没有则跳转到设置账号提醒页面
const accountState = useStorage('AccountState', false);

onMounted(() => {
  if (!accountState.value) {
    loading.value = false;
    return;
  }
  settingData.value.account && settingData.value.account.length > 0 && localStorage.setItem('AccountState', true)

})


const miEnabledDevices = computedAsync(async () => {

  const mi_did = await settingData.value.mi_did;
  const devices = settingData.value.devices;
  const miDeviceList =  mi_did.split(',').filter(Boolean).map((item) => {
    return {
      did: devices[item].did,
      name: devices[item].name,
      play_type: devices[item].play_type||0,
    }
  })
  localStorage.setItem('miEnabledDevices', JSON.stringify(miDeviceList))
  return miDeviceList
}, [])
// console.log('%csrc\App.vue:48 miEnabledDevices', 'color: #007acc;', miEnabledDevices);
const updateSetting = () => {
  const XMSetting = useSetting();
  settingData.value.mi_did = XMSetting.value.mi_did;
  // console.log('%csrc\App.vue:52 settingData.value.devices', 'color: #007acc;', settingData.value.devices);
}
loading.value = false;

</script>
<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
}

.nav {
  width: 200px;
}

.content {
  min-width: 50vw;
  padding: 20px;
  margin: 0 30px;
}

.loading_mask {
  margin: 0;
  padding: 0;
  width: 0;
}
</style>
