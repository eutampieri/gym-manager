<script lang="ts" setup>
import { getProfileIcon, User, Trainer, Admin, Role } from '@gym-manager/models';
import { useUserStore } from '../store/user';
import { ref } from 'vue';
import SectionContainer from '@/components/SectionContainer.vue';
import SectionContainerItem from '@/components/SectionContainerItem.vue';
import router from '@/routes/router';
import { useModalsStore } from '@/store/modals';

const props = defineProps<{ id?: string, role: string }>();

interface ProfileEntry {
    label: string,
    value: string,
    linkPrefix?: string
}

const client = useUserStore().client;
const confirm = useModalsStore().confirm;
const user = ref<User | Trainer | Admin>();
const profileData = ref<Array<ProfileEntry>>();
const profileIcon = ref('');
const logged = props.id == undefined || props.id == '' || client.userDetails?._id == props.id;
const showImpersonateButton = client.getRole == Role.Admin && !client.isImpersonating && props.role != 'admin';

function getUser(): Promise<undefined | User | Trainer | Admin> {
    console.log(props.role)
    if (!logged) {
        if (props.role == 'user') {
            return client.getUserById(props.id);
        } else if (props.role == 'trainer') {
            return client.getTrainerById(props.id);
        } else if (props.role == 'admin') {
            return client.getAdminById(props.id);
        } else {
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
getUser().then((x: undefined | User | Trainer | Admin) => {
    if (x) {
        user.value = x;
        profileData.value = Object.keys(x)
            .filter(k => Object.keys(fieldNameMapper).includes(k))
            .map(k => {
                let value = x[k as keyof typeof x] as string;

                // If the field is dateOfBirth, format the date using toLocaleDateString()
                if (k === 'dateOfBirth' && value) {
                    const date = new Date(value);
                    value = date.toLocaleDateString();  // Format the date
                }

                return {
                    label: fieldNameMapper[k as keyof typeof fieldNameMapper],
                    value: value,
                    linkPrefix: getLinkPrefix(k)
                }
            });
        profileIcon.value = getProfileIcon(x);
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
async function logout() {
    if (client.isImpersonating) {
        if (!await confirm("If you proceed, you will log out as an admin.")) return;
    }
    if (await client.logout()) {
        router.push({ "path": "/login" });
    }
}
async function impersonate() {
    if (await confirm(`Do you want to impersonate ${props.role} ${user.value?.username}?`)) {
        client.startImpersonating(user.value! as (User | Trainer), (props.role == 'user') ? Role.User : Role.Trainer);
        router.push({ path: '/' + props.role });
    }
}
</script>

<template>
    <SectionContainer>
        <SectionContainerItem id="profile">
            <div class="d-flex flex-column justify-content-center">
                <img :src="profileIcon" class="rounded mx-auto d-block my-5"
                    :alt="user?.username + 's profile picture'" />
                <dl>
                    <template v-for="item in profileData">
                        <dt class="text-center">{{ item.label }}</dt>
                        <dd class="text-center" v-if="item.linkPrefix"><a :href="item.linkPrefix + item.value">{{
                            item.value }}</a></dd>
                        <dd class="text-center" v-else>{{ item.value }}</dd>
                    </template>
                </dl>
                <div class="d-flex justify-content-evenly mt-2">
                    <button v-if="logged" type="button" class="btn btn-secondary m-2" @click="logout">Logout</button>
                    <button v-if="showImpersonateButton" type="button" class="btn btn-info m-2"
                        @click="impersonate">Impersonate</button>
                </div>
            </div>
        </SectionContainerItem>
    </SectionContainer>
</template>