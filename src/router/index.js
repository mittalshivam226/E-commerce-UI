import { createWebHistory, createRouter } from "vue-router";

import SearchPage from "/src/pages/SearchPage.vue";
import ProductDetailsPage from "/src/pages/ProductDetailsPage.vue";



const routes = [
    { path: "/", redirect: "/searchPage", component: SearchPage },
    { path: "/productDetailsPage/:productId?/:variantId?/:merchantId?", component: ProductDetailsPage }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;