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
    <div class="merchant">

        <p v-if="isSelected"><strong> Sold By</strong></p>

        <p><strong>Merchant:</strong> {{ listing.merchantId }}</p>
        <p><strong>Price:</strong> ₹{{ listing.sellingPrice }}</p>
        <p><strong>MRP:</strong> ₹{{ listing.mrp }}</p>

    </div>
</template>

<style scoped>

.merchant{
    border: 1px solid #ccc;
    padding: 12px; margin: 8px 0;
    border-radius: 4px;
}
</style>