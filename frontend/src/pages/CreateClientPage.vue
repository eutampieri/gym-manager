<script lang="ts" setup>
import { isOnlyLetters, isOnlyLettersSpaceInclusive, isOnlyNumbers } from '@/utils/validation';
import { computed, ref } from 'vue';
import { CreateUserRequest } from "@gym-manager/models";
import GenericInput from '@/components/GenericInput.vue';
import { useUserStore } from '../store/user';

const username = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");
const dateOfBirth = ref("");
const fiscalCode = ref("");
const address = ref("");
const id = ref("");
const message = ref("");


const usernameValid = ref(false);
const passwordValid = ref(false);
const firstNameValid = ref(false);
const lastNameValid = ref(false);
const emailValid = ref(false);
const phoneNumberValid = ref(false);
const dateOfBirthValid = ref(false);
const fiscalCodeValid = ref(false);
const addressValid = ref(false);
const idValid = ref(false);
const messageValid = ref(false);

const submitButtonEnabled = computed(() => usernameValid.value &&
    passwordValid.value &&
    firstNameValid.value &&
    lastNameValid.value &&
    emailValid.value &&
    phoneNumberValid.value &&
    dateOfBirthValid.value &&
    fiscalCodeValid.value &&
    addressValid.value &&
    idValid.value &&
    messageValid.value
);

const client = useUserStore().client;

async function checkId(id: string) {
    try {
        // FUNZIONE isClientPresent
        const response = await fetch(`/clients/checkId/${id}`);
        if (response.ok) {
            const check = await response.json();
            console.log("Risultato checkId:", check);
            return check;
        }
        else {
            message.value = 'Error in checking id';
        }
    } catch (error) {
        console.error('Error in checking id:', error);
        message.value = 'Error in checking id';
    }
}




async function handleCreateCourse() {
    message.value = "";
    // Controllo per username
    if (!isOnlyLetters(username.value)) {
        message.value = '';
        return;
    }
    // Verifica che la password abbia almeno 7 caratteri
    if (password.value.length < 7 && password.value.length > 10) {
        message.value = '';
        return; // Interrompe il processo se la password non è abbastanza lunga
    }

    if (!isOnlyLetters(firstName.value)) {
        message.value = 'FirstName can only contain letters';
        return;
    }
    if (!isOnlyLetters(lastName.value)) {
        message.value = 'LastName can only contain letters';
        return;
    }
    if (!isOnlyNumbers(phoneNumber.value)) {
        message.value = 'PhoneNumber can only contain numbers';
        return;
    }
    if (!isOnlyNumbers(id.value)) {
        message.value = 'Id can only contain numbers';
        return;
    }
    const idExists = await checkId(id.value);
    if (idExists) {
        message.value = 'Id already in use';
        return;
    }

    try {

        // Creazione dell'oggetto JSON con i dati del cliente
        const request: CreateUserRequest = {
            username: username.value,
            password: password.value,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            dateOfBirth: dateOfBirth.value,
            fiscalCode: fiscalCode.value,
            address: address.value,
        }


        // Effettua la richiesta POST per creare il cliente
        const response = await client.addUser(request);

        if (response.status === 201) {
            message.value = "Client successfully created!";
        } else {
            message.value = "Error during client creation";
        }
    } catch (error) {
        console.error("Error during client creation:", error);
        message.value = "Error during client creation";
    }

}



</script>
<template>
    <form id="clientForm">
        <h2>Creazione di {{ firstName === "" ? "un nuovo cliente" : firstName }}</h2>

        <GenericInput type="text" id="username" error-message="Lo username può contenere solo lettere."
            :validation-function="isOnlyLetters" v-model="username" v-model:valid="usernameValid">
            Username
        </GenericInput>

        <GenericInput type="password" id="password" error-message="The password must be at least 7 characters long."
            :validation-function="(x: string) => x.length >= 7" v-model="password" v-model:valid="usernameValid">
            Password
        </GenericInput>

        <GenericInput type="text" id="firstName" error-message="Il nome può contenere solo lettere."
            :validation-function="isOnlyLettersSpaceInclusive" v-model="firstName" v-model:valid="usernameValid">
            Nome
        </GenericInput>

        <div class="mb-3">
            <label class="form-label" for="lastName">lastName:</label>
            <input class="form-control" type="text" id="lastName" v-model="lastName">
        </div>

        <div class="mb-3">
            <label class="form-label" for="email">email:</label>
            <input class="form-control" type="email" id="email" v-model="email">
        </div>

        <div class="mb-3">
            <label class="form-label" for="phoneNumber">phoneNumber:</label>
            <input class="form-control" type="number" id="phoneNumber" v-model="phoneNumber">
        </div>

        <div class="mb-3">
            <label class="form-label" for="dateOfBirth">date of birth:</label>
            <input class="form-control" type="date" id="dateOfBirth" v-model="dateOfBirth">
        </div>

        <div class="mb-3">
            <label class="form-label" for="fiscalCode">fiscal code:</label>
            <input class="form-control" type="text" id="fiscalCode" v-model="fiscalCode">
        </div>

        <div class="mb-3">
            <label class="form-label" for="address">address:</label>
            <input class="form-control" type="text" id="address" v-model="address">
        </div>

        <div class="mb-3">
            <label class="form-label" for="id">ID:</label>
            <input class="form-control" type="number" id="id" v-model="id">
        </div>



        <button class="btn btn-primary" type="button" @click="handleCreateCourse()"
            :disabled="!submitButtonEnabled">Create Client {{ firstName }}</button>

    </form>

</template>