<script setup>
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { mockUsers } from "../../data/mockStudents";

// state
const activeStudent = inject("activeStudent");
const activeTab = ref("p1");

const tabs = [
  { id: "p1", label: "中一" },
  { id: "p2", label: "中二" },
  { id: "p3", label: "中三" },
  { id: "p4", label: "高一" },
  { id: "p5", label: "高二" },
  { id: "p6", label: "高三" },
];

const router = useRouter();
const handleSelectStudent = (student) => {
  Object.assign(activeStudent, student);
  router.push({ name: "chat" });
};
</script>

<template>
<div class="mybody">
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

    <section
      v-for="tab in tabs"
      :key="tab.id"
      :id="tab.id"
      class="content"
      v-show="activeTab === tab.id"
    > 
      <div
        v-for="student in mockUsers[tab.label]"
        class="student"
        @click="handleSelectStudent(student)"
        style="cursor: pointer;"
      > 
        <div class="student-row">
          <img src="../images/user-solid.svg" class="student-icon">
          <div class="student-column">
            <span class="student-name">{{ student.name }}</span>
            <div>
              <span 
                v-for="subject in student.subject"
                class="subject-name"
              >{{ subject }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>
</template>

<style scoped>
.mybody {
  padding: 2em;
  background-color: #ffffff;
}

.head {
  position: relative
}
.button-exit{
  padding: 2% 3.5%;
  border-radius:10px;
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
  border: 1px solid #ccc;
  border-radius: 4px;
}

.student {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

.student:last-child {
  border-bottom: none;
}

.student-row {
  display: flex;
  align-items: center;
  gap: 3%;
}

.student-column {
  display: flex;
  flex-direction: column;
  gap:2%;
}

.student-icon {
  margin:2px;
  width: 20px;
}

.subject-name {
  margin-left: 5px;
  background-color:#ddd;
  border-radius: 10%;
  padding: 3px;
}
</style>
