<script lang="ts" setup>
import { isOnlyLetters, isPhoneNumber } from '@/utils/validation';
import { computed, ref } from 'vue';
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import GenericInput from '@/components/GenericInput.vue';
import { CreateTrainerRequest } from '@gym-manager/models/trainer';
import { useUserStore } from '@/store/user';
import { useNotificationsStore } from '@/store/notifications';

const username = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");
const message = ref("");

const usernameValid = ref(false);
const passwordValid = ref(false);
const firstNameValid = ref(false);
const lastNameValid = ref(false);
const emailValid = computed(() => email.value.length > 0);
const phoneNumberValid = computed(() => phoneNumber.value.length > 0);

const submitButtonEnabled = computed(() => usernameValid.value &&
    passwordValid.value &&
    firstNameValid.value &&
    lastNameValid.value &&
    emailValid.value &&
    phoneNumberValid.value
);

const client = useUserStore().client;
const notificationStore = useNotificationsStore();

async function handleCreateTrainer() {
    try {

        // Creazione dell'oggetto JSON con i dati del cliente
        const request: CreateTrainerRequest = {
            username: username.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value
        }


        // Effettua la richiesta POST per creare il cliente
        const response = await client.addTrainer(request);

        if (response.status === 201) {
            notificationStore.fire({
                title: 'Success',
                body: `Trainer ${firstName.value} ${lastName.value} successfully created`,
                background: 'success',
                when: new Date(),
            });
        } else {
            notificationStore.fire({
                title: 'Error',
                body: 'Error while creating trainer',
                background: 'danger',
                when: new Date(),
            });
        }
    } catch (error) {
        notificationStore.fire({
            title: 'Errore',
            body: 'Error while creating trainer',
            background: 'danger',
            when: new Date(),
        });
    }

}
</script>
<template>
    
    <h2>Creating {{ firstName === "" ? "a new trainer" : `${firstName} ${lastName}` }}</h2>
    
    <form>
        <ValidatingGenericInput type="text" id="username" error-message="The username can only contain letters"
            :validation-function="isOnlyLetters" v-model="username" v-model:valid="usernameValid">
            Username
        </ValidatingGenericInput>

        <ValidatingGenericInput type="password" id="password"
            error-message="The password must be at least 7 characters long"
            :validation-function="(x: string) => x.length >= 7" v-model="password" v-model:valid="passwordValid">
            Password
        </ValidatingGenericInput>

        <ValidatingGenericInput type="text" id="firstName" error-message="The name can only contain letters"
            :validation-function="isOnlyLetters" v-model="firstName" v-model:valid="firstNameValid">
            Name
        </ValidatingGenericInput>

        <ValidatingGenericInput error-message="The surname can only be made of letters"
            :validation-function="isOnlyLetters" type="text" id="lastName" v-model="lastName"
            v-model:valid="lastNameValid">Surname
        </ValidatingGenericInput>

        <GenericInput type="email" id="email" v-model="email">Email
            address</GenericInput>

        <ValidatingGenericInput :validation-function="isPhoneNumber" error-message="Invalid phone number" type="tel"
            id="phoneNumber" v-model="phoneNumber">
            Phone number
        </ValidatingGenericInput>

        <button class="btn btn-primary" type="button" @click="handleCreateTrainer()"
            :disabled="!submitButtonEnabled">Create Trainer {{ firstName }}</button>

        <p v-if="message">
            {{ message }}
        </p>

    </form>

</template>