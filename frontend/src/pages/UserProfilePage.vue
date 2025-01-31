<script lang="ts" setup>
import { Admin, Trainer, User } from '@gym-manager/models';
import { useUserStore } from '../store/user';
import { ref } from 'vue';

interface ProfileEntry {
    label: String,
    value: String,
    linkPrefix?: String
}

const client = useUserStore().client;
const profileData = ref<Array<ProfileEntry>>()

// get the logged user info
const user = client.getUserDetails;
const fieldNameMapper = {
    username: 'Username',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    dateOfBirth: 'Date of birth',
    address: 'Address',
    fiscalCode: 'CF',
}
// prepare the display data
if (user) {
    profileData.value = Object.keys(user).map(k => {
        return {
            label: fieldNameMapper[k as keyof typeof fieldNameMapper],
            value: user[k as keyof typeof user],
            linkPrefix: getLinkPrefix(user[k as keyof typeof user])
        }
    });
} else {
    // error
}
function getLinkPrefix(field: String): String | undefined {
    if (field == 'email') {
        return 'mailto:';
    } else if (field == 'phoneNumber') {
        return 'tel:';
    } else {
        return undefined;
    }
}
</script>

<template>
    <h1>User Profile</h1>
    <div>
        <img src="" alt="???'s profile picture"/>
        <dl>
            <template v-for="item in profileData">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
            </template>
        </dl>
    </div>
</template>

<style>

</style>