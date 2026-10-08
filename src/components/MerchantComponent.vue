<script setup>
import BuyComponent from './BuyComponent.vue';
defineProps({
    listing: {
        type: Object,
        required: true
    },
    isSelected: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <div style="border: 1px solid #ccc; padding: 12px; margin: 8px 0;">

        <p v-if="isSelected"><strong> Sold By</strong></p>

        <p><strong>Merchant:</strong> {{ listing.merchantId }}</p>
        <p><strong>Price:</strong> ₹{{ listing.sellingPrice }}</p>
        <p><strong>MRP:</strong> ₹{{ listing.mrp }}</p>

    </div>
</template>

<style scoped></style>