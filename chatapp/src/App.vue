<script setup>
import { provide, ref } from "vue";

const teacherName = ref("");
const studentName = ref("");

provide("teacherName", teacherName);
provide("studentName", studentName);
</script>

<template>
  <router-view />
</template>

<style scoped></style>
