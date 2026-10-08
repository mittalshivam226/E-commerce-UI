<script setup>
import { ref } from "vue";

const props = defineProps({
    listing: {
        type: Object,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    variantId: {
        type: String,
        required: true
    }
});

const ORDER_URL = "http://localhost:8081/order/createOrder";
const CUSTOMER_ID = "cust_1";

const quantity = ref(1);
const deliveryAddress = ref("");
const placing = ref(false);

function placeOrder() {
    if (quantity.value > props.listing.availableStock) {
        alert(`${props.listing.availableStock} items left`);
        return;
    }

    if (!deliveryAddress.value.trim()) {
        alert("Delivery Address Mandatory");
        return;
    }

    const totalPrice = props.listing.sellingPrice * quantity.value;

    const orderPayload = {
        merchantId:      props.listing.merchantId,
        productId:       props.productId,
        variantId:       props.variantId,
        customerId:      CUSTOMER_ID,
        mrp:             props.listing.mrp,
        unitPrice:       props.listing.sellingPrice,
        quantity:        quantity.value,
        totalPrice:      totalPrice,
        deliveryAddress: deliveryAddress.value.trim()
    };

    placing.value = true;

    fetch(ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(msg => { throw new Error(msg || response.status); });
        }
        return response.json();
    })
    .then(() => {
        alert("Order placed successfully!");
        quantity.value = 1;
        deliveryAddress.value = "";
    })
    .catch(err => {
        alert(`Order Failed: ${err.message}`);
    })
    .finally(() => {
        placing.value = false;
    });
}
</script>
<template>
    <div class="order-container">
        <h4>Place Order</h4>

        <div class="form-group">
            <label>Quantity:</label><br />
            <input v-model.number="quantity" type="number" min="1" class="input-quantity"/>
            <span class="stock-info">
                ({{ listing.availableStock }} in stock)
            </span>
        </div>

        <div class="form-group">
            <label>Delivery Address:</label><br />
            <textarea v-model="deliveryAddress" class="textarea-address" placeholder="Enter full delivery address" />
        </div>

        <p class="total-price">
            Total: <strong>Rs. {{ (listing.sellingPrice * quantity).toFixed(2) }}</strong>
        </p>

        <button
            @click="placeOrder"
            :disabled="listing.availableStock === 0 || placing"
            class="btn-submit">
            {{ placing ? "Placing..." : (listing.availableStock === 0 ? "Out of Stock" : "Place Order") }}
        </button>
    </div>
</template>

<style scoped>
.order-container {
    border: 1px solid #ccc;
    padding: 16px;
    margin-top: 12px;
}

.form-group {
    margin-bottom: 8px;
}

.input-quantity {
    padding: 6px;
    width: 80px;
    margin-top: 4px;
}

.stock-info {
    margin-left: 8px;
    color: #555;
    font-size: 13px;
}

.textarea-address {
    padding: 6px;
    width: 100%;
    max-width: 400px;
    margin-top: 4px;
}

.total-price {
    font-size: 14px;
    margin-bottom: 8px;
}

.btn-submit {
    padding: 8px 20px;
}
</style>
