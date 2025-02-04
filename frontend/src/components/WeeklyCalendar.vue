<script setup lang="ts">
import { computed } from 'vue';

const monday = new Date();
monday.setDate(monday.getDate() - monday.getDay() + 1);
const days = [0, 1, 2, 3, 4, 5, 6].map((x) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + x);
    return d;
});
const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

const oneOnOnes = [];
const courses = [];

const cells = computed(() => {
    let grid = [];
    for (let d = 0; d < 7; d += 1) {
        grid.push([]);
        for (let h = 0; h < 24; h++) {
            grid[d].push([]);
        }
    }
    return grid;
});
console.log(cells.value);

</script>
<template>
    <table class="table">
        <thead>
            <tr>
                <th></th>
                <th v-for="d, i in days" :key="i" scope="col">{{ d.toLocaleDateString() }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="hour in hours" :key="hour">
                <th scope="row">{{ hour.toString().padStart(2, '0') }}:00</th>
                <td v-for="_, i in days" :key="i">
                    {{ cells[i][hour] }}
                </td>
            </tr>
        </tbody>
    </table>
</template>