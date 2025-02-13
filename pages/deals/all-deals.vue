<template>
    <div>
        <!-- breadcrumb component -->
        <breadcrumb />

        <section class="py-4">
            <div class="px-4 mx-auto">
                <div class="grid grid-cols-1 gap-12 mt-8 lg:col-gap-12 xl:col-gap-10 lg:mt-12 lg:grid-cols-5 lg:gap-10">
                    <div class="lg:col-span-3 lg:row-end-1">
                        <div class="lg:flex lg:items-start">
                            <div class="lg:order-2 lg:ms-5">
                                <div class="max-w-xl overflow-hidden rounded-lg">
                                    <img class="object-cover w-full max-w-full h-96" :src="selectedImage"
                                        alt="product-img-1" />
                                </div>
                            </div>

                            <div class="w-full mt-2 lg:order-1 lg:w-32 lg:flex-shrink-0">
                                <div class="flex flex-row items-start gap-2 lg:flex-col">
                                    <button type="button" v-for="(image, index) in imageList" :key="index"
                                        @click="setSelectedImage(image)"
                                        class="w-24 h-20 p-1 mb-3 overflow-hidden text-center border border-gray-200 rounded-lg flex-0 aspect-square">
                                        <img class="object-cover w-full h-full rounded-lg" :src="image"
                                            alt="product-img-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-8 lg:row-span-2 lg:row-end-2">
                        <div class="lg:ps-6">
                            <div class="mb-6">
                                <span class="text-red-500 dark:text-red-200">{{ currentDeal?.brand }}</span>
                                <h2 class="max-w-xl mt-2 mb-4 text-2xl font-bold font-heading dark:text-gray-300">
                                    {{ currentDeal?.title }}
                                </h2>
                            </div>

                            <div class="flex mb-6 item-center gap-x-6">
                                <div class="flex items-center space-s-2">
                                    <p class="text-2xl font-bold text-red-600 dark:text-red-500">{{
                                        currentDeal?.discountedPrice }}
                                        epg</p>
                                    <p class="text-base font-semibold text-gray-600 line-through dark:text-gray-300"
                                        v-if="currentDeal?.originalPrice">{{ currentDeal?.originalPrice
                                        }} epg</p>
                                </div>
                                <div class="flex py-1.5 px-2 bg-purple-600 font-semibold !ms-4 rounded-lg">
                                    <span class="text-sm text-white">save {{ currentDeal?.discount }}%</span>
                                </div>
                            </div>

                            <div class="gap-4 pb-5 border-b border-gray-300">
                                <div class="flex items-center justify-around gap-5 mt-5">
                                    <div v-for="(value, key) in currentDealTime" :key="key"
                                        class="flex flex-col items-center space-y-2">
                                        <div class="flex items-center justify-center w-10 h-10 border-2 rounded-full"
                                            :class="`border-${key}`">
                                            <span class="text-lg font-bold">{{ value }}</span>
                                        </div>
                                        <span class="text-sm capitalize">{{ key }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="gap-4 pb-5 border-b border-gray-300">
                                <div class="max-w-2xl custom-scroll max-h-32">
                                    <div class="mt-6">
                                        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">Description</h3>
                                        <p class="mt-4 text-sm text-gray-600 dark:text-gray-100">{{
                                            currentDeal?.description
                                            }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="gap-4 border-b border-gray-300">
                                <div class="py-6">
                                    <p class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        Color
                                    </p>
                                    <div class="flex flex-wrap items-center gap-2 mt-3 select-none">
                                        <label v-for="color in currentDeal?.colors" :key="color">
                                            <input type="radio" name="type" value="" class="sr-only peer" />
                                            <p
                                                class="px-6 py-2 font-bold border border-black rounded-lg peer-checked:bg-black peer-checked:text-white dark:border-gray-400">
                                                {{ color }}
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="gap-4 border-b border-gray-300">
                                <div class="py-6">
                                    <p class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        Size
                                    </p>
                                    <div class="flex flex-wrap items-center gap-2 mt-3 select-none">
                                        <label v-for="size in currentDeal?.sizes" :key="size">
                                            <input type="radio" name="type" value="" class="sr-only peer" />
                                            <p
                                                class="px-6 py-2 font-bold border border-black rounded-lg peer-checked:bg-black peer-checked:text-white dark:border-gray-400">
                                                {{ size }}
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-full">
                        <nav class="flex gap-4">
                            <nuxt-link to=""
                                class="py-2 text-sm font-semibold text-gray-900 border-b-2 border-gray-900 dark:border-gray-200 dark:text-gray-200">
                                Upcoming Deals
                            </nuxt-link>
                        </nav>

                        <div class="flow-root mt-8 sm:mt-12">
                            <div class="grid grid-cols-2 gap-4 md:grid-cols-2 max-sm:justify-center gap-y-8 sm:gap-x-6">
                                <div class="flex items-center gap-6 overflow-hidden cursor-pointer max-sm:flex-col"
                                    v-for="(deal, index) in nextDeals" :key="index">
                                    <div class="w-24 h-24 p-3 overflow-hidden bg-gray-100 rounded-lg shrink-0">
                                        <img :src="deal.imageUrl1" alt="product1"
                                            class="object-contain w-full h-full" />
                                    </div>
                                    <div class="max-sm:text-center">
                                        <h3 class="text-sm font-bold text-gray-800 sm:text-base dark:text-gray-200">{{
                                            deal.title }}</h3>
                                        <h4 class="mt-1 text-xs font-bold text-blue-600 dark:text-blue-400">{{
                                            deal.brand }}</h4>
                                        <h4 class="mt-1 text-xs font-bold text-blue-600 dark:text-blue-400">Save {{
                                            deal.discount }}%</h4>
                                        <h4 class="mt-1 text-xs font-bold text-blue-600 dark:text-blue-400">{{
                                            deal.discountedPrice }} egp
                                        </h4>
                                        <h4 class="mt-1 text-xs font-bold text-red-600 dark:text-red-400">{{
                                            formatRemainingTime(deal.remainingTime) }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const { t } = useI18n();
const todayDealStore = useTodayDealStore();

const currentDeal = computed(() => todayDealStore.currentDeal);
const nextDeals = computed(() => todayDealStore.nextDeals);

const nextDealStartTime = ref(null);

const currentDealTime = ref({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
});

const calculateRemainingTime = (timestamp) => {
    const now = new Date().getTime();
    const targetTime = new Date(timestamp.seconds * 1000).getTime();
    const diff = targetTime - now;
    if (diff <= 0) return null;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    return { days, hours, minutes, seconds };
};

const updateCurrentDealTime = () => {
    if (!currentDeal.value?.endTime) return;
    const remaining = calculateRemainingTime(currentDeal.value.endTime);
    if (remaining) {
        currentDealTime.value = remaining;
    } else {
        currentDealTime.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
};

const updateNextDealsTimes = () => {
    nextDeals.value.forEach((deal) => {
        deal.remainingTime = calculateRemainingTime(deal.startTime);
    });
};

const updateNextDealStartTime = () => {
    if (!nextDeals.value || nextDeals.value.length === 0) {
        nextDealStartTime.value = null;
        return;
    }
    const nextDeal = nextDeals.value.find(
        (deal) => new Date(deal.startTime.seconds * 1000) > new Date()
    );
    nextDealStartTime.value = nextDeal
        ? calculateRemainingTime(nextDeal.startTime)
        : null;
};

let interval;

onMounted(() => {
    todayDealStore
        .fetchDeals()
        .then(() => {
            const firstImage = todayDealStore.currentDeal?.imageUrl1;
            if (firstImage) selectedImage.value = firstImage;
            interval = setInterval(() => {
                updateCurrentDealTime();
                updateNextDealsTimes();
            }, 1000);
            updateCurrentDealTime();
            updateNextDealsTimes();
            updateNextDealStartTime();
            setInterval(() => {
                updateNextDealStartTime();
            }, 1000);
        })
        .catch((error) => {
            console.error("Error fetching deals:", error);
        });
});

onBeforeUnmount(() => {
    if (interval) clearInterval(interval);
});

const formatRemainingTime = (timeObj) => {
    if (
        typeof timeObj === "object" &&
        timeObj.days !== undefined &&
        timeObj.hours !== undefined &&
        timeObj.minutes !== undefined &&
        timeObj.seconds !== undefined
    ) {
        return `${timeObj.days} days ${timeObj.hours} hrs ${timeObj.minutes} mins ${timeObj.seconds} secs`;
    }
    return "Invalid time";
};

const imageList = computed(() =>
    [
        todayDealStore.currentDeal?.imageUrl1,
        todayDealStore.currentDeal?.imageUrl2,
        todayDealStore.currentDeal?.imageUrl3,
        todayDealStore.currentDeal?.imageUrl4,
    ].filter(Boolean)
);

const selectedImage = ref('');

const setSelectedImage = (image) => {
    selectedImage.value = image;
};

definePageMeta({
    layout: 'dashboard'
})

useHead({
    titleTemplate: () => t('head.all_deals'),
});
</script>

<style scoped>
.custom-scroll {
    overflow-y: scroll;
}

.custom-scroll::-webkit-scrollbar {
    display: none;
}

.custom-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>