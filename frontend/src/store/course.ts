import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { CourseDELETETHIS } from '../utils/course';

export const useCourseStore = defineStore('course', () => {
    const jwt = ref(null);
    const isAuthenticated = computed(() => jwt.value !== null);
    const course = new CourseDELETETHIS();

    return {
        jwt,
        isAuthenticated,
        course,
    };
});