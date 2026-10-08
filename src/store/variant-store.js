import { defineStore } from 'pinia'

const PRODUCT_SERVICE_URL = "http://10.17.48.129:8000/product";

export const useVariantStore = defineStore('variantStore', {
    state: () => ({
        variantData: [],
        selectedVariant: null,
        otherVariants: [],
    }),

    actions: {
        setVariantData(data) {
            this.variantData = data;
        },

        setSelectedVariantById(variantId) {
            this.selectedVariant = this.variantData.find(v => v.variantId === variantId) || null;

            this.otherVariants = this.variantData.filter(v => v.variantId !== variantId);
        },

        setSelectedVariant(variant) {
            this.selectedVariant = variant;
            this.otherVariants = this.variantData.filter(v => v.variantId !== variant.variantId);
        },

        fetchVariants(productId) {
            return fetch(`${PRODUCT_SERVICE_URL}/getAllVariantsByProductId?productId=${productId}`)
                .then(response => {
                    if (!response.ok) throw new Error(`Error fetching variants: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    this.setVariantData(data);
                });
        }
    }
})