<script setup>
const props = defineProps({
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
        <img v-if="img" :src="img" :alt="altText"/>
        <div class="no-img" v-else>
            No Image
        </div>
    </div>
</template>

<style scoped>
img{
    width: 300px;
    height: 300px;
    object-fit: contain;
    border: 1px solid #ccc;
}

.no-img{
    width: 300px;
    height: 300px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;

}
</style>