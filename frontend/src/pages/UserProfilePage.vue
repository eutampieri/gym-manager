<script lang="ts" setup>
import { Admin, getProfileIcon, Trainer, User } from '@gym-manager/models';
import { useUserStore } from '../store/user';
import { ref } from 'vue';
import sha256 from "sha256";

interface ProfileEntry {
    label: string,
    value: string,
    linkPrefix?: string
}

const client = useUserStore().client;
const profileData = ref<Array<ProfileEntry>>();
const profileIcon = ref('');

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
    profileData.value = Object.keys(fieldNameMapper).map(k => {
        return {
            label: fieldNameMapper[k as keyof typeof fieldNameMapper],
            value: user[k as keyof typeof user] as string,
            linkPrefix: getLinkPrefix(k)
        }
    });
    profileIcon.value = getProfileIcon(user);
} else {
    // error
}

function getLinkPrefix(field: String): string | undefined {
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
    <section class="container ">
        <div class="d-flex justify-content-center">
            <h1>User Profile</h1>
        </div>
        <div class="d-flex flex-column justify-content-center">
            <img :src="profileIcon" class="rounded mx-auto d-block" :alt="user?.username + 's profile picture'"/>
            <dl class="mx-auto w-75">
                <template v-for="item in profileData">
                    <dt>{{ item.label }}</dt>
                    <dd v-if="item.linkPrefix"><a :href="item.linkPrefix + item.value">{{ item.value }}</a></dd>
                    <dd v-else>{{ item.value }}</dd>
                </template>
            </dl>
        </div> 
    </section>
</template>