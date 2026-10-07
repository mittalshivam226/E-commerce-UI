<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVariantStore } from "../store/variant-store.js";
import { useMerchantStore } from "../store/merchant-store.js";
import { storeToRefs } from "pinia";
import ImageComponent    from "../components/ImageComponent.vue";
import VariantComponent  from "../components/VariantComponent.vue";
import MerchantComponent from "../components/MerchantComponent.vue";

const route  = useRoute();
const router = useRouter();

const PRODUCT_SERVICE_URL = "/product";

const product        = ref(null);
const productLoading = ref(false);



const productError   = ref(null);

function loadProduct() {
    const productId = route.params.productId;
    if (!productId) {
        productError.value = "Product details require a productId in the URL.";
        return;
    }

    productLoading.value = true;
    productError.value = null;

    fetch(`${PRODUCT_SERVICE_URL}/getProductById?productId=${productId}`)
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            product.value = data;
            productLoading.value = false;
        })
        .catch(err => {
            productError.value = err.message;
            productLoading.value = false;
        });
}

const variantStore = useVariantStore();
const { variantData, selectedVariant, otherVariants } = storeToRefs(variantStore);

function onVariantSelected(variant) {
    variantStore.setSelectedVariant(variant);

    merchantStore.fetchMerchantsByProductAndVariant(
        route.params.productId,
        variant.variantId
    );

    const unwatch = watch(() => merchantStore.merchantData,
        (listings) => {
            if (listings.length > 0) {
                const sorted = [...listings].sort((a, b) => a.sellingPrice - b.sellingPrice);
                merchantStore.setSelectedMerchant(sorted[0].merchantId);
                unwatch();
            }
        }
    );
}


const merchantStore = useMerchantStore();
const { selectedMerchant, otherMerchants } = storeToRefs(merchantStore);

onMounted(() => {

    loadProduct();
    if (!route.params.productId) return;

    variantStore.fetchVariants(route.params.productId);

    const unwatchVariants = watch(variantData, (variants) => {
        if (variants.length > 0) {
            variantStore.setSelectedVariantById(route.params.variantId);
            unwatchVariants();
        }
    });

    if (route.params.variantId) {
        merchantStore.fetchMerchantsByProductAndVariant(route.params.productId, route.params.variantId);

        const unwatchMerchants = watch(
            () => merchantStore.merchantData,
            (listings) => {
                if (listings.length > 0) {
                    merchantStore.setSelectedMerchant(route.query.merchantId);
                    unwatchMerchants();
                }
            }
        );
    }
});
</script>

<template>
    <div style="padding: 20px;">

        <br>
        <br>

        <p v-if="productLoading">Loading product...</p>

        <div v-if="productError" style="color: red;">
            <p>{{ productError }}</p>
        </div>

        <div v-if="product">

            

            <ImageComponent
                :img="selectedVariant ? selectedVariant.img : null"
                :alt-text="product.productName" />

            <br>
            <h1>{{ product.productName }}</h1>
            <p><strong>Brand:</strong> {{ product.brand }}</p>
            <p><strong>Category:</strong> {{ product.category }}</p>

            <hr>

            <div v-if="otherVariants.length > 0">
                <h3>Other Variants:</h3>
                <br>
                <VariantComponent
                    v-for="variant in otherVariants"
                    :key="variant.variantId"
                    :variant="variant"
                    :is-selected="false"
                    @select="onVariantSelected"/>
            </div>

            <hr>

            <p v-if="product.usp"><strong>USP:</strong> {{ product.usp }}</p>
            


            <h3>Sold By</h3>
            <MerchantComponent
                v-if="selectedMerchant"
                :listing="selectedMerchant"
                :is-selected="true"/>
            <p v-else>Loading seller info...</p>


            <div v-if="otherMerchants.length > 0">
                <h3>Other Merchants: ({{ otherMerchants.length }})</h3>
                <MerchantComponent
                    v-for="listing in otherMerchants"
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

<style scoped></style>