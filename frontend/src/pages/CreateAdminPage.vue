<script lang="ts" setup>
import { isOnlyLetters } from '@/utils/validation';
import { computed, ref } from 'vue';
import ValidatingGenericInput from '@/components/ValidatingGenericInput.vue';
import CheckBox from '@/components/CheckBox.vue';
import { Admin, CreateAdminRequest } from '@gym-manager/models/user';
import { useUserStore } from '@/store/user';
import { useNotificationsStore } from '@/store/notifications';
import SectionContainerItem from '@/components/SectionContainerItem.vue';
import SectionContainer from '@/components/SectionContainer.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const username = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const hasFullPrivileges = ref(false);

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
const notification = useNotificationsStore();

const props = defineProps<{ id?: string }>();

if (props.id) {
    client.getAdminById(props.id).then(r => {
        if (r) {
            username.value = r.username;
            firstName.value = r.firstName;
            lastName.value = r.lastName;
            password.value = '*******';
            hasFullPrivileges.value = r.hasFullPrivileges;
        } else {
            notification.fire({
                title: 'Error',
                body: 'This admin could not be found',
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
        hasFullPrivileges: hasFullPrivileges.value
    }) as CreateAdminRequest;

async function handleUpdateAdmin() {
    try {
        const request = createRequest();
        const id = props.id!;
        const response = await client.updateAdmin(id, request);

        if (response) {
            notification.fire({
                title: 'Success',
                body: `Admin ${firstName.value} ${lastName.value} successfully updated!`,
                background: 'success',
                when: new Date(),
            });
            router.back();
        } else {
            throw new Error();
        }
    } catch (error) {
        notification.fire({
            title: 'Error',
            body: 'Error while updating the admin',
            background: 'danger',
            when: new Date(),
        });
    }
}

async function handleCreateAdmin() {
    try {
        const request = createRequest();
        const response = await client.addAdmin(request);

        if (response) {
            notification.fire({
                title: 'Success',
                body: `Admin ${firstName.value} ${lastName.value} successfully created!`,
                background: 'success',
                when: new Date(),
            });
            router.back();
        } else {
            throw new Error();
        }
    } catch (error) {
        notification.fire({
            title: 'Error',
            body: 'Error while creating the admin',
            background: 'danger',
            when: new Date(),
        });
    }
}
</script>

<template>
    <h2 v-if="props.id" class="text-center">Update {{ username != '' ? username : 'Admin' }}</h2>
    <h2 v-else class="text-center">Create {{ username != '' ? username : 'a new Admin' }}</h2>
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

                <CheckBox type="boolean" id="hasFullPrivileges" v-model="hasFullPrivileges">
                    Privilege</CheckBox>

                <button v-if="props.id" class="btn btn-primary" type="button" @click="handleUpdateAdmin"
                    :disabled="!submitButtonEnabled">Update Admin {{ firstName }}</button>
                <button v-else class="btn btn-primary" type="button" @click="handleCreateAdmin"
                    :disabled="!submitButtonEnabled">Create Admin {{ firstName }}</button>
            </form> 
        </SectionContainerItem>
    </SectionContainer>
    
</template>