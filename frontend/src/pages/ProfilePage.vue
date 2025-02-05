<script lang="ts" setup>
import { getProfileIcon, User, Trainer, Admin, Role } from '@gym-manager/models';
import { useUserStore } from '../store/user';
import { ref } from 'vue';
import Header from '@/components/header/Header.vue';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';
import router from '@/routes/router';

const props = defineProps<{ id: string, role: Role }>();

interface ProfileEntry {
    label: string,
    value: string,
    linkPrefix?: string
}

const client = useUserStore().client;
const userName = ref('');
const profileData = ref<Array<ProfileEntry>>();
const profileIcon = ref('');
const logged = props.id == undefined || props.id == '';

function getUser(): Promise<undefined | User | Trainer | Admin> {
    if (props.id) {
        if (props.role == Role.User) {
            return client.getUserById(props.id);
        } else if (props.role == Role.Trainer) {
            return client.getTrainer(props.id);
        } else {
            // TODO
            return Promise.reject();
        }
    } else {
        return Promise.resolve(client.userDetails);
    }
}
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
getUser().then((user: undefined | User | Trainer | Admin) => {
    if (user) {
        userName.value = user.username;
        profileData.value = Object.keys(user)
            .filter(k => Object.keys(fieldNameMapper).includes(k))
            .map(k => {
                return {
                    label: fieldNameMapper[k as keyof typeof fieldNameMapper],
                    value: user[k as keyof typeof user] as string,
                    linkPrefix: getLinkPrefix(k)
                }
            });
        profileIcon.value = getProfileIcon(user);
    }
});

function getLinkPrefix(field: string): string | undefined {
    if (field == 'email') {
        return 'mailto:';
    } else if (field == 'phoneNumber') {
        return 'tel:';
    } else {
        return undefined;
    }
}
function logout() {
    client.logout().then(res => {
        if (res) {
            router.push({ "path": "/login" });
        }
    })
}
</script>

<template>
    <SectionContainer>
        <SectionContainerItem id="profile">
            <div class="d-flex flex-column justify-content-center">
                <img :src="profileIcon" class="rounded mx-auto d-block my-5" :alt="userName + 's profile picture'" />
                <dl>
                    <template v-for="item in profileData">
                        <dt class="text-center">{{ item.label }}</dt>
                        <dd class="text-center" v-if="item.linkPrefix"><a :href="item.linkPrefix + item.value">{{ item.value }}</a></dd>
                        <dd class="text-center" v-else>{{ item.value }}</dd>
                    </template>
                </dl>
                <button v-if="logged" type="button" class="btn btn-secondary m-2 mx-auto" @click="logout">Logout</button>
            </div>
        </SectionContainerItem>
    </SectionContainer>
</template>