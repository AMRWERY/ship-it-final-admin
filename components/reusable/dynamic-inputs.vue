<template>
  <div>
    <Form v-slot="{ errors }">
      <div class="my-4">
        <label :for="id"
          :class="['block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200', errors[name] ? 'text-red-600' : 'text-slate-700']">
          {{ label }}
          <span v-if="required" class="text-red-600 dark:text-red-500">*</span>
        </label>

        <div class="relative w-full">
          <!-- prefix-icon -->
          <span v-if="prefixIcon"
            :class="['absolute inset-y-0 flex items-center text-gray-400 dark:text-gray-100 start-3 hover:text-gray-600 hover:dark:text-gray-200', errors[name] ? 'text-red-600' : 'text-slate-400']">
            <icon :name="prefixIcon" class="w-5 h-5" />
          </span>
          <!-- input -->
          <!-- <Field :type="showPassword ? 'text' : type" :name="name" :placeholder="placeholder" :id="id"
            :readonly="readonly" v-model="internalValue" :rules="rules" :class="[
              'w-full px-3 py-2 transition duration-300 bg-transparent border rounded-md shadow-sm pe-16 placeholder:text-slate-400 dark:placeholder:text-slate-100 text-slate-700 dark:text-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow ps-9',
              errors[name] ? 'border-red-600' : 'border-slate-200'
            ]" /> -->
          <template v-if="type === 'textarea'">
            <Field as="textarea" :name="name" :placeholder="placeholder" :id="id" :readonly="readonly"
              v-model="internalValue" :rules="rules"
              class="block w-full px-3 py-2 transition duration-300 bg-transparent border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pe-16 text-slate-700 ease hover:border-slate-300 focus:shadow ps-9"
              rows="4" />
          </template>

          <template v-else>
            <Field :type="showPassword ? 'text' : type" :name="name" :placeholder="placeholder" :id="id"
              :readonly="readonly" v-model="internalValue" :rules="rules" :class="[
                'w-full block px-3 py-2 border-gray-300 transition duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border rounded-md shadow-sm pe-16 placeholder:text-slate-400 dark:placeholder:text-slate-300 text-slate-700 ease hover:border-slate-300 focus:shadow ps-9',
                errors[name] ? 'border-red-600' : 'border-slate-200'
              ]" />
          </template>
          <!-- Eye icon -->
          <span v-if="type === 'password'" @click="togglePassword"
            class="absolute inset-y-0 flex items-center text-gray-400 cursor-pointer dark:text-gray-100 end-3 hover:text-gray-600 dark:hover:text-gray-300">
            <icon
              :name="showPassword ? 'material-symbols:visibility-off-rounded' : 'material-symbols:visibility-rounded'"
              class="w-5 h-5" />
          </span>
        </div>

        <!-- error messages -->
        <div class="mt-1">
          <span class="font-medium text-red-600 dark:text-red-500">{{ errors[name] }}</span>
        </div>
        <!-- <div class="mt-1">
          <ErrorMessage :name="name" class="text-red-600 dark:text-red-400" />
        </div> -->
      </div>
    </Form>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    // required: true
  },
  label: {
    type: String,
    // required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
  },
  rules: {
    type: [Object, String],
    default: () => { },
  },
  errors: {
    type: [Object, String],
    default: () => { },
  },
  required: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: String,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Password visibility toggle
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>