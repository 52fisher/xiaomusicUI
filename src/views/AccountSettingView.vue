<template>
    <el-form :model="data" label-width="auto" style="max-width: 600px" label-position="top" v-if="data" >
        <el-form-item label="小米账号">
          <el-input v-model="data.account" />
        </el-form-item>
        <el-form-item label="小米密码">
            <el-input v-model="data.password" type="password" />
          </el-form-item>
          <el-form-item label="XIAOMUSIC_HOSTNAME(IP或域名)">
            <el-input v-model="data.hostname" >
                <template #prepend>http://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="关闭密码验证">
            <el-switch v-model="data.disable_httpauth" />
        </el-form-item>
        <template v-if="!data.disable_httpauth">
          <el-form-item label="web登录账户">
            <el-input v-model="data.httpauth_username" />
          </el-form-item>
          <el-form-item label="web登录密码">
            <el-input v-model="data.httpauth_password" />
          </el-form-item>
        </template>
          <el-form-item label="开启调试日志" label-position="left">
            <el-switch v-model="data.verbose" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
      </el-form>
</template>
<script setup>

import { toRaw } from 'vue'
import Setting from '@/components/Setting.js';
const data= Setting.useSetting()

function onSubmit() {
  Setting.saveSetting(toRaw(data.value))
  Setting.clearSetting()
  Setting.useSetting()
}
</script>