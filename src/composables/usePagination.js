import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";


export function usePagination(items, size = 10) {
    const route = useRoute();
    const router = useRouter();

    const pageSize = ref(size);

    const currentPage = ref(parseInt(route.query.page) || 1);

    watch(
        () => route.query.page,
        (newPage) => {
            const parsed = parseInt(newPage) || 1;
            if (currentPage.value !== parsed) {
                currentPage.value = parsed;
            }
        }
    );

    const totalPages = computed(() =>
        Math.max(1, Math.ceil(items.value.length / pageSize.value))
    );

    const paginatedItems = computed(() => {
        const safePage = Math.min(currentPage.value, totalPages.value);
        const start = (safePage - 1) * pageSize.value;
        return items.value.slice(start, start + pageSize.value);
    });

    function changePage(direction) {
        if (direction === "next" && currentPage.value < totalPages.value) {
            currentPage.value++;
        } else if (direction === "prev" && currentPage.value > 1) {
            currentPage.value--;
        } else {
            return;
        }
        router.push({ query: { ...route.query, page: currentPage.value } });
    }

    return { pageSize, currentPage, totalPages, paginatedItems, changePage };
}