<script setup lang="ts">
import { Message as IMessage } from '@/utils/chat';
import { BasicIdentifiable, Role, roleToString } from '@gym-manager/models';
import { onMounted, ref, useTemplateRef } from 'vue';
import NameLink from './NameLink.vue';
import Message from './Message.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleXmark, faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const messageBar = useTemplateRef('messageBar');
const emit = defineEmits<{ send: [string], close: [] }>();
defineProps<{
    isActive: boolean,
    messages: IMessage[],
    otherParty: [BasicIdentifiable, Role],
}>();
const minimised = defineModel<boolean>();
const currentMessage = ref("");
const minimise = () => minimised.value = true;
const expand = () => minimised.value = false;
const close = () => emit("close");
function send() {
    if (currentMessage.value.trim() !== "") {
        emit("send", currentMessage.value);
        currentMessage.value = "";
        messageBar.value?.focus();
    }
}
function adjustHeight(event?: Event) {
    const textarea = event ? (event.target as HTMLTextAreaElement) : document.querySelector(".auto-expand") as HTMLTextAreaElement;
    if (textarea) {
        textarea.style.height = "auto"; 
        textarea.style.height = textarea.scrollHeight + "px"; 
    }
}
onMounted(() => {
    adjustHeight(); 
});
</script>
<template>
    <div v-if="isActive" class="fixed-bottom">
        <div v-if="!minimised"
            :class="`chat-container-${$matches.sm.max ? 'full' : 'small'} d-flex flex-column col-md-7 col-xl-5 p-3 m-0 mb-md-5 me-md-4 float-md-end bg-body-secondary rounded-${$matches.sm.max ? '0' : '5'} border`">
            <section class="d-flex flex-row">
                <section class="flex-grow-1">
                    <h2>Support chat</h2>
                    <h3 v-if="otherParty[1] != Role.Admin">with
                        <NameLink :path="`/${roleToString(otherParty[1])}?id=${otherParty[0].id}`">
                            {{ otherParty[0].firstName }} {{ otherParty[0].lastName }} ({{ otherParty[1] }})
                        </NameLink>
                    </h3>
                </section>
                <button @click="minimise" class="align-self-center btn btn-light">
                    <FontAwesomeIcon :icon="faChevronDown"></FontAwesomeIcon>
                </button>
            </section>
            <button @click="close" role="button" class="btn btn-danger mx-auto mt-2 mb-5">
                <FontAwesomeIcon :icon="faCircleXmark"></FontAwesomeIcon>
                Close chat
            </button>
            <section class="flex-grow-1 overflow-auto mb-3">
                <Message v-for="message, index in messages" :key="index" :message="message.message"
                    :sent-by-current-user="message.sentByCurrentUser"></Message>
            </section>
            <section class="input-group mb-3 align-self-end">
                <textarea ref="messageBar" v-model="currentMessage" class="form-control auto-expand" aria-label="Write a message..." rows="1" @input="adjustHeight" @keydown.enter="send"></textarea>
                <button class="btn btn-primary" @click="send">
                    <FontAwesomeIcon :icon="faPaperPlane"></FontAwesomeIcon>
                </button>
            </section>
        </div>
        <div v-else class="fixed-bottom m-md-4 mb-md-5 d-grid d-md-block">
            <button class="btn btn-primary shadow float-md-end pt-2 pb-5 py-md-4 fs-6 text-decoration-underline"
                @click="expand">
                Resume chat with {{ otherParty[0].firstName }} {{ otherParty[0].lastName }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.chat-container-full {
    max-height: calc(100dvh - 5em) !important;
}

.chat-container-small {
    height: 85vh !important;
    max-height: 900px !important;
}
.auto-expand {
    resize: none; 
    overflow-y: hidden; 
    max-height: 150px;
    min-height: 40px; 
    line-height: 1.4;
}

</style>