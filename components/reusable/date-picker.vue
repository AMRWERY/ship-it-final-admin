<template>
    <div>
        <div class="relative">
            <!-- Read-only date input toggles the calendar popup -->
            <div class="relative">
                <!-- Calendar icon positioned at the end of the input -->
                <span class="absolute inset-y-0 flex items-center pointer-events-none ps-3 start-0">
                    <icon name="material-symbols:calendar-today" class="w-5 h-5 text-slate-400" />
                </span>
                <input type="text" readonly :value="formattedDate" @click="toggleCalendar"
                    class="w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-300 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow ps-9"
                    :placeholder="$t('form.select_date')" />
            </div>

            <!-- Calendar Popup -->
            <div v-if="showCalendar"
                class="absolute z-50 p-4 mt-2 bg-white border rounded-md shadow-lg start-0 w-80 dark:bg-[#181a1b]">
                <!-- Calendar Header -->
                <div class="flex items-center justify-between mb-4">
                    <!-- Prev/Next Month Navigation -->
                    <icon name="material-symbols:arrow-circle-left-rounded"
                        class="text-gray-600 hover:text-gray-800 focus:outline-none dark:text-gray-200 dark:hover:text-gray-400 rtl:rotate-180"
                        @click="prevMonth" />
                    <!-- Month-Year Label: Click to toggle the month/year selector -->
                    <div @click="toggleMonthYearSelector" class="text-lg font-medium cursor-pointer">
                        {{ monthYear }}
                    </div>
                    <icon name="material-symbols:arrow-circle-right-rounded"
                        class="text-gray-600 hover:text-gray-800 focus:outline-none dark:text-gray-200 dark:hover:text-gray-400 rtl:rotate-180"
                        @click="nextMonth" />
                </div>

                <!-- Conditionally display either the Calendar Grid or the Month-Year Selector -->
                <div v-if="!showMonthYearSelector">
                    <!-- Days of the Week -->
                    <div
                        class="grid grid-cols-7 gap-1 mb-2 text-xs font-medium text-center text-gray-500 dark:text-gray-100">
                        <div v-for="(day, index) in daysOfWeek" :key="index">{{ day }}</div>
                    </div>
                    <!-- Dates Grid -->
                    <div class="grid grid-cols-7 gap-1 text-center">
                        <!-- Placeholders for the first week -->
                        <div v-for="n in firstDayOffset" :key="'empty-' + n" class="h-8"></div>
                        <!-- Days -->
                        <button v-for="day in daysInMonth" :key="day" @click="selectDate(day)"
                            class="h-8 rounded-md hover:bg-blue-100 focus:outline-none"
                            :class="{ 'bg-blue-200 dark:bg-blue-600': isSelected(day) }">
                            {{ day }}
                        </button>
                    </div>
                </div>

                <!-- Month-Year Selector -->
                <div v-else class="overflow-y-auto max-h-[210px] custom-scrollbar">
                    <!-- Month Selector -->
                    <div class="mb-4">
                        <h4 class="mb-2 font-semibold">Select Month</h4>
                        <div class="grid grid-cols-3 gap-2">
                            <button v-for="(monthName, index) in months" :key="index" @click="selectMonth(index)"
                                class="py-1 rounded" :class="{
                                    'bg-blue-500 text-white dark:bg-blue-700': index === currentMonth,
                                    'bg-gray-100 text-gray-700': index !== currentMonth
                                }">
                                {{ monthName }}
                            </button>
                        </div>
                    </div>
                    <!-- Year Selector -->
                    <div>
                        <h4 class="mb-2 font-semibold">Select Year</h4>
                        <select v-model="selectedYear" @change="selectYear" class="w-full p-1 border rounded-md">
                            <option v-for="year in yearsRange" :key="year" :value="year"
                                class="bg-white dark:bg-[#181a1b] text-slate-700 dark:text-slate-200">{{ year }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: [Date, String, Object],
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const parseDate = (value) => {
    if (value instanceof Date) {
        return value;
    } else if (typeof value === 'string') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    } else if (value && typeof value === 'object') {
        // Example: value may have properties: year, month, day
        if (value.year && value.month && value.day) {
            const d = new Date(value.year, value.month - 1, value.day);
            return isNaN(d.getTime()) ? null : d;
        }
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }
    return null;
};

const showCalendar = ref(false);
const showMonthYearSelector = ref(false);

const currentDate = ref(parseDate(props.modelValue) || new Date());
const selectedDate = ref(parseDate(props.modelValue) || null);
const selectedYear = ref(currentDate.value.getFullYear());

watch(
    () => props.modelValue,
    (newVal) => {
        const d = parseDate(newVal);
        if (d) {
            currentDate.value = d;
            selectedDate.value = d;
            selectedYear.value = d.getFullYear();
        }
    }
);

const formattedDate = computed(() => {
    if (!selectedDate.value) return '';
    return selectedDate.value.toLocaleDateString('default');
});

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const monthYear = computed(() => {
    return new Date(currentYear.value, currentMonth.value).toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
});

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Computed: Number of days in the current month
const daysInMonth = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value + 1, 0);
    const days = date.getDate();
    return isNaN(days) ? 0 : days;
});

const firstDayOffset = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value, 1);
    const offset = date.getDay();
    return isNaN(offset) ? 0 : offset;
});

const toggleCalendar = () => {
    showCalendar.value = !showCalendar.value;
    if (showCalendar.value === true) {
        showMonthYearSelector.value = false;
    }
};

const toggleMonthYearSelector = () => {
    showMonthYearSelector.value = !showMonthYearSelector.value;
};

const prevMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
    selectedYear.value = currentDate.value.getFullYear();
};

const nextMonth = () => {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
    selectedYear.value = currentDate.value.getFullYear();
};

const selectDate = (day) => {
    const newDate = new Date(currentYear.value, currentMonth.value, day);
    selectedDate.value = newDate;
    emit('update:modelValue', newDate);
    showCalendar.value = false;
};

const selectMonth = (monthIndex) => {
    currentDate.value = new Date(currentYear.value, monthIndex, 1);
    showMonthYearSelector.value = false;
};

const selectYear = () => {
    currentDate.value = new Date(Number(selectedYear.value), currentMonth.value, 1);
    showMonthYearSelector.value = false;
};

const isSelected = (day) => {
    if (!selectedDate.value) return false;
    const date = selectedDate.value instanceof Date ? selectedDate.value : new Date(selectedDate.value);
    return (
        date.getFullYear() === currentYear.value &&
        date.getMonth() === currentMonth.value &&
        date.getDate() === day
    );
};

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const yearsRange = computed(() => {
    const base = currentYear.value;
    const start = base - 10;
    const end = base + 10;
    const years = [];
    for (let y = start; y <= end; y++) {
        years.push(y);
    }
    return years;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Hide scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    display: none;
}

.custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>