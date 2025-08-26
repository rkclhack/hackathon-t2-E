<script setup>
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { mockUsers } from "../../data/mockStudents";

// state
const activeStudent = inject("activeStudent");
const activeTab = ref("p1");

const tabs = [
  { id: "p1", label: "中学一年生" },
  { id: "p2", label: "中学二年生" },
  { id: "p3", label: "中学三年生" },
  { id: "p4", label: "高校一年生" },
  { id: "p5", label: "高校二年生" },
  { id: "p6", label: "高校三年生" },
];

const tabLabel = ["中一", "中二", "中三", "高一", "高二", "高三"]

const router = useRouter();
const handleSelectStudent = (student) => {
  Object.assign(activeStudent, student);
  router.push({ name: "chat" });
};
</script>

<template>
  <div class="head">
    <span style="font-size: 32px;">生徒一覧</span>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit">
        ログアウト
      </button>
    </router-link>
  </div>
  <div class="container">
    <ul class="tabs">
      <li v-for="tab in tabs" :key="tab.id">
        <a
          href="#"
          :class="{ active: activeTab === tab.id }"
          @click.prevent="activeTab = tab.id"
          >{{ tab.label }}</a
        >
      </li>
    </ul>
    <ul class="tabs">
      <li v-for="tab in tabLabel" :key="tab.id">
        <a
          href="#"
          :class="{ active: activeTab === tab.id }"
          @click.prevent="activeTab = tab.id"
          >{{ tab }}</a
        >
      </li>
    </ul>

    <section
      v-for="tab in tabs"
      :key="tab.id"
      :id="tab.id"
      class="content"
      v-show="activeTab === tab.id"
    >
      <div
        v-for="student in mockUsers[tab.label]"
        class="student-name"
        @click="handleSelectStudent(student)"
        style="cursor: pointer; text-decoration: underline"
      >
        <div>{{ student.name }}</div>
        <div v-for="subject in student.subject">{{ subject }}</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.head {
  position: relative
}
.button-exit{
  padding: 2% 3.5%;
  border-radius:6%;
  background: #f48356;
  color: #fff;
  font-weight: 700;
  font-size: 95%;
  position: absolute;
  right: 0;
}

.tabs {
  display: flex;
  list-style: none;
  padding: 0;
  margin-bottom: 16px;
}

.tabs li a {
  display: block;
  padding: 8px 16px;
  margin-right: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
}

.tabs li a.active {
  background-color: orange;
  color: white;
  border-color: orange;
}

.content {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.student-name:hover {
  color: orange;
}

.subject-name {
  margin-left: 5px;
  background-color:#ddd;
  border-radius: 10%;
  padding: 3px;
}
</style>
