<script lang="ts" setup>
import { ref } from 'vue';
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

function isOnlyLetters(input: string) {
        return /^[a-zA-Z]+$/.test(input);
}
function isOnlyNumbers(input: string) {
        return /^\d+$/.test(input);
}
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
                message.value ='Error in checking id';
            }
        } catch (error) {
            console.error('Error in checking id:', error);
            message.value ='Error in checking id' ;
        }
}




async function handleCreateCourse() {
    message.value = "";
    // Controllo per username
        if (!isOnlyLetters(username.value)) {
            message.value = 'The username can only contain letters';
            return;
        }
        // Verifica che la password abbia almeno 7 caratteri
        if (password.value.length < 7 && password.value.length > 10) {
            message.value = 'The password must be at least 7 characters long and less than 10';
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
        const formData = new FormData();
        formData.set('username', username.value);
        formData.set('password', password.value);
        formData.set('firstName', firstName.value);
        formData.set('lastName', lastName.value);
        formData.set('email', email.value);
        formData.set('phoneNumber', phoneNumber.value);
        formData.set('dateOfBirth', dateOfBirth.value);
        formData.set('fiscalCode', fiscalCode.value);
        formData.set('address', address.value);
        formData.set('id', id.value);

        let clientData: Record<string, string> = {};
        formData.forEach((value, key) => {
            clientData[key] = value as string;
        });

        console.log("Dati inviati:", JSON.stringify(clientData));

        // Effettua la richiesta POST per creare il cliente
        const response = await fetch('/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

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
    <div id="message" style="color: red;">{{ message }}</div> <!-- Div per il messaggio di successo/insuccesso -->
     <form id="clientForm">
     <h2>Creazione di {{ firstName === "" ? "un nuovo cliente" : firstName }}</h2>
   <div class="mb-3">
   <label class="form-label"for="username">Username:</label>
   <input class="form-control"type="text" id="username" v-model="username">
   </div>
   
   <div class="mb-3">
   <label class="form-label"for="password">Password:</label>
   <input class="form-control"type="password" id="password" v-model="password">
   </div>
   
   <div class="mb-3">
   <label class="form-label"for="firstName">firstName:</label>
   <input class="form-control"type="text" id="firstName" v-model="firstName">
   </div>
   
   <div class="mb-3">
   <label class="form-label"for="lastName">lastName:</label>
   <input class="form-control"type="text" id="lastName" v-model="lastName">
   </div>
   
   <div class="mb-3">
   <label class="form-label"for="email">email:</label>
   <input class="form-control"type="email" id="email" v-model="email">
   </div>
   
   <div class="mb-3">
   <label class="form-label"for="phoneNumber">phoneNumber:</label>
   <input class="form-control"type="number" id="phoneNumber" v-model="phoneNumber">
   </div>

   <div class="mb-3">
   <label class="form-label"for="dateOfBirth">date of birth:</label>
   <input class="form-control"type="date" id="dateOfBirth" v-model="dateOfBirth">
   </div>

   <div class="mb-3">
   <label class="form-label"for="fiscalCode">fiscal code:</label>
   <input class="form-control"type="text" id="fiscalCode" v-model="fiscalCode">
   </div>

   <div class="mb-3">
   <label class="form-label"for="address">address:</label>
   <input class="form-control"type="text" id="address" v-model="address">
   </div>
   
   <div class="mb-3">
   <label class="form-label"for="id">ID:</label>
   <input class="form-control"type="number" id="id" v-model="id">
   </div>
   
  
   
   <button class="btn btn-primary" type="button" @click="handleCreateCourse()">Create Client {{firstName }}</button>
   
   </form>
   
   </template>