<template>
    <div>
        <!-- Overlay Component -->
        <overlay :visible="authStore.isOverlayVisible" />

        <slot />
    </div>
</template>

<script setup>
const authStore = useAuthStore();
</script>