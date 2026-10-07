<script setup>
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

        <p v-if="isSelected"><strong>✓ Sold By</strong></p>

        <p><strong>Merchant:</strong> {{ listing.merchantId }}</p>
        <p><strong>Price:</strong> ₹{{ listing.sellingPrice }}</p>
        <p><strong>MRP:</strong> ₹{{ listing.mrp }}</p>
        <p><strong>In Stock:</strong> {{ listing.availableStock }}</p>
        <p><strong>Sold:</strong> {{ listing.soldStock }}</p>

        <button
            :disabled="listing.availableStock === 0"
            style="padding: 8px 16px; margin-top: 8px;"
        >
            {{ listing.availableStock === 0 ? 'Out of Stock' : 'Buy Now' }}
        </button>
    </div>
</template>

<style scoped></style>