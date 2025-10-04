<template>
    <div class="warning-tip">
        <el-tooltip class="box-item" effect="light" placement="bottom">
            <iconWarning />
            <template #content>
                <slot></slot>
            </template>
        </el-tooltip>
    </div>
</template>
<script setup>
import iconWarning from '@/components/icons/iconWarning.vue'
</script>
<style scoped>
.warning-tip {
    display: flex;
    margin-left: 20px;
}
</style>