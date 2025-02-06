<script lang="ts" setup>
import { isOnlyLetters, isPhoneNumber } from '@/utils/validation';
import { computed, ref } from 'vue';
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import GenericInput from '@/components/GenericInput.vue';
import { CreateTrainerRequest } from '@gym-manager/models';
import { useUserStore } from '@/store/user';
import { useNotificationsStore } from '@/store/notifications';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';

const username = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");

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
const notification = useNotificationsStore();

const props = defineProps<{ id?: string }>();

if (props.id) {
    client.getTrainerById(props.id).then(r => {
        if (r) {
            username.value = r.username;
            firstName.value = r.firstName;
            lastName.value = r.lastName;
            password.value = '*******';
            email.value = r.email;
            phoneNumber.value = r.phoneNumber;
        } else {
            notification.fire({
                title: 'Error',
                body: 'This trainer could not be found',
                background: 'danger'
            })
        }
    })
}
const createRequest = () => ({
        username: username.value,
        password: password.value == '*******' ? undefined : password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNumber: phoneNumber.value
    }) as CreateTrainerRequest;

async function handleUpdateTrainer() {
    try {
        const request = createRequest()
        const id = props.id!;
        const response = await client.updateTrainer(id, request);

        if (response) {
            notification.fire({
                title: 'Success',
                body: `Trainer ${firstName.value} ${lastName.value} successfully updated!`,
                background: 'success',
                when: new Date(),
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        notification.fire({
            title: 'Error',
            body: 'Error while updating the trainer',
            background: 'danger',
            when: new Date(),
        });
    }
}

async function handleCreateTrainer() {
    try {
        const request = createRequest()
        const response = await client.addTrainer(request);

        if (response) {
            notification.fire({
                title: 'Success',
                body: `Trainer ${firstName.value} ${lastName.value} successfully created`,
                background: 'success',
                when: new Date(),
            });
        } else {
            throw new Error();
        }
    } catch (error) {
        notification.fire({
            title: 'Error',
            body: 'Error while creating the trainer',
            background: 'danger',
            when: new Date(),
        });
    }
}
</script>
<template>
    <h2 v-if="props.id" class="text-center">Update {{ username != '' ? username : 'Trainer' }}</h2>
    <h2 v-else class="text-center">Create {{ username != '' ? username : 'a new Trainer' }}</h2>
    <SectionContainer>
        <SectionContainerItem>
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

                <button v-if="props.id" class="btn btn-primary" type="button" @click="handleUpdateTrainer"
                    :disabled="!submitButtonEnabled">Update Trainer {{ firstName }}</button>
                <button v-else class="btn btn-primary" type="button" @click="handleCreateTrainer"
                    :disabled="!submitButtonEnabled">Create Trainer {{ firstName }}</button>
            </form>
        </SectionContainerItem>
    </SectionContainer>
    
</template>