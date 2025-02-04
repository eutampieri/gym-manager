<script setup lang="ts">
import { Message as IMessage } from '@/utils/chat';
import { Admin, Role } from '@gym-manager/models';
import { ref } from 'vue';
import NameLink from './NameLink.vue';
import Message from './Message.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleXmark, faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';


const emit = defineEmits<{ send: [string], close: [] }>();
defineProps<{
    isActive: boolean,
    messages: IMessage[],
    otherPart: [Admin, Role],
}>();
const minimised = ref(false);
const currentMessage = ref("");
const minimise = () => minimised.value = true;
const expand = () => minimised.value = false;
const close = () => emit("close");
function send() {
    emit("send", currentMessage.value);
    currentMessage.value = "";
}
</script>
<template>
    <section v-if="isActive">
        <section v-if="!minimised" class="d-flex flex-column">
            <section class="d-flex flex-row ">
                <section class="flex-grow-1">
                    <h2>Support chat</h2>
                    <h3 v-if="otherPart[1] != Role.Admin">with
                        <NameLink path="">
                            {{ otherPart[0].firstName }} {{ otherPart[0].lastName }} ({{ otherPart[1] }})
                        </NameLink>
                    </h3>
                </section>
                <button @click="minimise" class="align-self-center btn btn-light">
                    <FontAwesomeIcon :icon="faChevronDown"></FontAwesomeIcon>
                </button>
            </section>
            <div class="text-center m-2">
                <button @click="close" role="button" class="btn btn-danger">
                    <FontAwesomeIcon :icon="faCircleXmark"></FontAwesomeIcon>
                    Close chat
                </button>
            </div>
            <section class="flex-grow-1">
                <Message v-for="message, index in messages" :key="index" :message="message.message"
                    :sent-by-current-user="message.sentByCurrentUser"></Message>
            </section>
            <div class="input-group mb-3">
                <input v-model="currentMessage" type="text" class="form-control" aria-label="Search">
                <button class="btn btn-primary" @click="send">
                    <FontAwesomeIcon :icon="faPaperPlane"></FontAwesomeIcon>
                </button>
            </div>
        </section>
        <div v-else class="d-grid gap-2">
            <button class="btn btn-primary btn-lg" @click="expand">
                Resume chat with {{ otherPart[0].firstName }} {{ otherPart[0].lastName }}
            </button>
        </div>
    </section>
</template>