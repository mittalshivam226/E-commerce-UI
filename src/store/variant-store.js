import { defineStore } from 'pinia'


export const useVariantStore = defineStore('variantStore', {
    state: () => ({
        variantData: [],
        selectedVariant: null,
        otherVariants: [],
    }),
    getters: {

    },

    actions: {
        setVariantData(data) {
            this.variantData = data;
        },
        setSelectedVariantById(variantId) {
            this.selectedVariant = this.variantData.find(v => v.variantId === variantId) || null;


            this.otherVariants = this.variantData.filter(v => v.variantId !== variantId
            );
        },

        setSelectedVariant(variant) {
            this.selectedVariant = variant;
            this.otherVariants = this.variantData.filter(v => v.variantId !== variant.variantId
            );
        },

        fetchVariants(productId) {
            const GET_ALL_VARIANTS_API_URL = "http://localhost:8000/product/getAllVariants";
            fetch(`${GET_ALL_VARIANTS_API_URL}&productId=${productId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error in fetching variants: ${response.status}`);
                    }
                    return response.json();
                })
                .then(Data => {
                    this.setVariantData(Data);
                })
                .catch(error => console.log("Error Occured in variants"))
        }

    }
})