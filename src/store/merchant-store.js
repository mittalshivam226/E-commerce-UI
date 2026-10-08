import { defineStore } from 'pinia'



export const useMerchantStore = defineStore('merchantStore', {
    state: () => ({
        merchantData: [],
        selectedMerchant: null,
        otherMerchants: [],
    }),
    getters: {

    },

    actions: {
        setMerchantData(data) {
            this.merchantData = data;
        },
        setSelectedMerchant(merchantId) {
            this.selectedMerchant = this.merchantData.find(listing => listing.merchantId === merchantId) || null;
            
            this.otherMerchants = this.merchantData.filter(listing => listing.merchantId !== merchantId
            );
        },


        fetchMerchantsByProductAndVariant(productId, variantId) {
            const GET_CORRESPONDING_MERCHANTS_API_URL = "http://10.17.48.129:8080/listing/getListingsByProductAndVariant";
            
            return fetch(`${GET_CORRESPONDING_MERCHANTS_API_URL}?productId=${productId}&variantId=${variantId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error in fetching merchants: ${response.status}`);
                    }
                    return response.json();
                })
                .then(Data => {
                    this.setMerchantData(Data);
                })
                .catch(error => console.log("Error Occured in merchants"))
        }
    }
})