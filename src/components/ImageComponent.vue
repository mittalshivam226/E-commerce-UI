<script setup>
defineProps({
    img: {
        type: String,
        default: null
    },
    altText: {
        type: String,
        default: "Product Image"
    }
});
</script>

<template>
    <div>
        <img
            v-if="img" :src="img" :alt="altText"
            style="width: 300px; height: 300px; object-fit: contain; border: 1px solid #ccc;"
        />
        <div
            v-else
            style="width: 300px; height: 300px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center;"
        >
            No Image
        </div>
    </div>
</template>

<style scoped></style>