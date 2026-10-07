<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    searchHint: String,
    initialValue: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["handleSearch"]);

const searchQuery = ref(props.initialValue);

watch(
    () => props.initialValue,
    (val) => {
        searchQuery.value = val;
    }
);

function onSearchClick() {
    emit("handleSearch", searchQuery.value);
}
</script>

<template>
    <input v-model="searchQuery" type="text" :placeholder="searchHint" @keyup.enter="onSearchClick" />
    <button @click="onSearchClick">Search</button>
</template>

<style></style>