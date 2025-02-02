import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Course } from '../utils/course';

export const useCourseStore = defineStore('course', () => {
    const jwt = ref(null);
    const isAuthenticated = computed(() => jwt.value !== null);
    const course = new Course();

    return {
        jwt,
        isAuthenticated,
        course,
    };
});