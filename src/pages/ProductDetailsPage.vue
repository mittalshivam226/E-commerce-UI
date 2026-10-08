<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVariantStore } from "../store/variant-store.js";
import { useMerchantStore } from "../store/merchant-store.js";
import { storeToRefs } from "pinia";
import ImageComponent    from "../components/ImageComponent.vue";
import VariantComponent  from "../components/VariantComponent.vue";
import MerchantComponent from "../components/MerchantComponent.vue";
import BuyComponent      from "../components/BuyComponent.vue";

const route  = useRoute();
const router = useRouter();


const PRODUCT_SERVICE_URL = "http://localhost:8000/product";

const product        = ref(null);
const productLoading = ref(false);
const productError   = ref(null);

function loadProduct() {
    productLoading.value = true;
    productError.value   = null;

    return fetch(`${PRODUCT_SERVICE_URL}/getProductById?productId=${route.params.productId}`)
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            product.value        = data;
            productLoading.value = false;
        })
        .catch(err => {
            productError.value   = err.message;
            productLoading.value = false;
        });
}

const variantStore  = useVariantStore();
const merchantStore = useMerchantStore();

const { variantData, selectedVariant, otherVariants } = storeToRefs(variantStore);
const { selectedMerchant, otherMerchants }             = storeToRefs(merchantStore);

function onVariantSelected(variant) {
    variantStore.setSelectedVariant(variant);

    merchantStore.setMerchantData([]);
    merchantStore.selectedMerchant = null;
    merchantStore.otherMerchants  = [];

    merchantStore
        .fetchMerchantsByProductAndVariant(route.params.productId, variant.variantId)
        .then(() => {
            if (merchantStore.merchantData.length === 0) return;
            // Auto-select cheapest when user clicks a variant
            const cheapest = [...merchantStore.merchantData]
                .sort((a, b) => a.sellingPrice - b.sellingPrice)[0];
            merchantStore.setSelectedMerchant(cheapest.merchantId);
        })
        .catch(err => console.error("Error loading merchants:", err));
}




onMounted(() => {
    const variantId  = route.params.variantId  || null;
    const merchantId = route.params.merchantId || null;

    loadProduct()
        .then(() => variantStore.fetchVariants(route.params.productId))
        .then(() => {
            if (variantId) {
                variantStore.setSelectedVariantById(variantId);
            }
            if (!variantId) return;

            return merchantStore
                .fetchMerchantsByProductAndVariant(route.params.productId, variantId)
                .then(() => {
                    if (merchantStore.merchantData.length === 0) return;

                    if (merchantId) {
                        merchantStore.setSelectedMerchant(merchantId);
                    } 
                    else {
                        const cheapest = [...merchantStore.merchantData].sort((a, b) => a.sellingPrice - b.sellingPrice)[0];
                        merchantStore.setSelectedMerchant(cheapest.merchantId);
                    }
                });
        })

        .catch(err => console.error("Error on mount:", err));
});
</script>
<template>
    <div class="product-detail-container">

        <button @click="router.push('/')">Back to Search</button>

        <br>
        <br>
        <p v-if="productLoading">Loading product...</p>

        <div v-if="productError" class="error-container">
            <p>{{ productError }}</p>
            <button @click="loadProduct">Retry</button>
        </div>

        <div v-if="product">
            <h1>{{ product.productName }}</h1>
            <p><strong>Brand:</strong> {{ product.brand }}</p>
            <p><strong>Category:</strong> {{ product.category }}</p>
            <p v-if="product.usp"><strong>USP:</strong> {{ product.usp }}</p>
            <hr>

            <ImageComponent
                :img="selectedVariant ? selectedVariant.img : null"
                :alt-text="product.productName"/>
            <br>
            <div v-if="variantData.length > 0">
                <h3>Variants</h3>
                <VariantComponent
                    v-for="variant in variantData"
                    :key="variant.variantId"
                    :variant="variant"
                    :is-selected="selectedVariant && selectedVariant.variantId === variant.variantId"
                    @select="onVariantSelected"/>
            </div>

            <hr>

            <h3>Sold By</h3>
            <MerchantComponent
                v-if="primaryMerchant"
                :listing="primaryMerchant"
                :is-primary="true"/>

            <p v-else-if="selectedVariant">Loading seller info...</p>
            <p v-else class="no-seller-info">Select a variant to see seller info.</p>




            <BuyComponent v-if="primaryMerchant"
                :listing="primaryMerchant"
                :product-id="route.params.productId"
                :variant-id="selectedVariant ? selectedVariant.variantId : route.params.variantId"/>


            <div v-if="otherMerchants.length > 0">

                <h3>Other Sellers ({{ otherMerchants.length }})</h3>
                <MerchantComponent v-for="listing in otherMerchants"
                    :key="listing.listingId"
                    :listing="listing"/>
            </div>

            <hr>

            <h3>Product Description</h3>
            <p>{{ product.description }}</p>

            <h3>Features</h3>
            <ul>
                <li>Brand: {{ product.brand }}</li>
                <li>Category: {{ product.category }}</li>
                <template v-if="selectedVariant">
                    <li v-if="selectedVariant.colour">Colour: {{ selectedVariant.colour }}</li>
                    <li v-if="selectedVariant.size">Size: {{ selectedVariant.size }}</li>
                    <li v-if="selectedVariant.storage">Storage: {{ selectedVariant.storage }}</li>
                    <li v-if="selectedVariant.ram">RAM: {{ selectedVariant.ram }}</li>
                    <li v-if="selectedVariant.capacity">Capacity: {{ selectedVariant.capacity }}</li>
                </template>
            </ul>

        </div>

    </div>
</template>

<style scoped>
.product-detail-container {
    padding: 20px;
}

.error-container {
    color: red;
}

.no-seller-info {
    color: #888;
}
</style>
