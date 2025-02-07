<script setup lang="ts">
import { io } from 'socket.io-client';
import { EventType, SubscriptionEntity } from '@gym-manager/models';
import { useUserStore } from '@/store/user';
import { onMounted } from 'vue';

export interface CourseAvailabilityUpdate {
    course: string,
    availability: number,
    dayOfWeek: string,
    startTime: string,
}

const emit = defineEmits<{ update: [CourseAvailabilityUpdate] }>();

const client = useUserStore().client;
const socket = io({
    path: "/api/socketio",
});

onMounted(() => {
    socket.emit(EventType.Subscribe.toString(), { token: client.authToken!, entity: SubscriptionEntity.CourseAvailability });
});

socket.on(
    EventType.SubscriptionUpdate.toString(),
    (u: CourseAvailabilityUpdate) => emit('update', u)
);

</script>
<template>
</template>