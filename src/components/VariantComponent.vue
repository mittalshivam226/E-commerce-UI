<script setup>
defineProps({
    variant: {
        type: Object,
        required: true
    },
    isSelected: {
        type: Boolean,
        default: false
    }
});

defineEmits(["select"]);
</script>

<template>
    <button @click="$emit('select', variant)"
        :style="{
            padding: '6px 12px',
            margin: '4px',
            cursor: 'pointer',
            border: isSelected ? '2px solid blue' : '1px solid #ccc',
            background: isSelected ? '#e8e8ff' : '#fff'
        }"
    >
        <span v-if="variant.colour">{{ variant.colour }}</span>
        <span v-if="variant.storage"> / {{ variant.storage }}</span>
        <span v-if="variant.ram"> / {{ variant.ram }}</span>
        <span v-if="variant.size"> / {{ variant.size }}</span>
        <span v-if="variant.capacity"> / {{ variant.capacity }}</span>
    </button>
</template>

<style scoped></style>