<script lang="ts" setup>
import { isOnlyLetters } from '@/utils/validation';
import { computed, ref } from 'vue';
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import CheckBox from '@/components/CheckBox.vue';
import { CreateAdminRequest } from '@gym-manager/models/admin';
import Header from '@/components/Header.vue';
import { useUserStore } from '@/store/user';

const username = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const hasFullPrivileges = ref(false);
const message = ref("");

const usernameValid = ref(false);
const passwordValid = ref(false);
const firstNameValid = ref(false);
const lastNameValid = ref(false);

const submitButtonEnabled = computed(() => usernameValid.value &&
    passwordValid.value &&
    firstNameValid.value &&
    lastNameValid.value
);

const client = useUserStore().client;

async function handleCreateAdmin() {
    try {

        // Creazione dell'oggetto JSON con i dati del cliente
        const request: CreateAdminRequest = {
            username: username.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            hasFullPrivileges: hasFullPrivileges.value
        }


        // Effettua la richiesta POST per creare il cliente
        const response = await client.addAdmin(request);

        if (response.status === 201) {
            message.value = "Admin successfully created!";
        } else {
            message.value = "Error during admin creation";
        }
    } catch (error) {
        console.error("Error during admin creation:", error);
        message.value = "Error during admin creation";
    }

}
</script>
<template>
    <Header>
        <h2>Creating {{ firstName === "" ? "a new admin" : `${firstName} ${lastName}` }}</h2>
    </Header>

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

        <CheckBox type="boolean" id="hasFullPrivileges" v-model="hasFullPrivileges">
            Privilege</CheckBox>


        <button class="btn btn-primary" type="button" @click="handleCreateAdmin()"
            :disabled="!submitButtonEnabled">Create Admin {{ firstName }}</button>

        <p v-if="message">
            {{ message }}
        </p>

    </form>

</template>