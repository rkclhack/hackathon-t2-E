<script setup>
import { provide, reactive, ref } from "vue";

const teacherName = ref("");
const activeStudent = reactive({ name: "", subject: "" });

provide("teacherName", teacherName);
provide("activeStudent", activeStudent);
</script>

<template>
  <router-view />
</template>

<style scoped></style>
