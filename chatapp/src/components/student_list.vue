<script setup>
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

// state
const studentName = inject("studentName");
const activeTab = ref("p1");

const tabs = [
  { id: "p1", label: "中学一年生", description: "馬場 浩稀" },
  { id: "p2", label: "中学二年生", description: "佐藤 太郎" },
  { id: "p3", label: "中学三年生", description: "鈴木 花子" },
  { id: "p4", label: "高校一年生", description: "高橋 健" },
  { id: "p5", label: "高校二年生", description: "田中 美咲" },
  { id: "p6", label: "高校三年生", description: "伊藤 翔" },
];

const router = useRouter();
const handleSelectStudent = (tab) => {
  studentName.value = tab.description;
  router.push({ name: "chat" });
};
</script>

<template>
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
      <span
        class="student-name"
        @click="handleSelectStudent(tab)"
        style="cursor: pointer; text-decoration: underline"
      >
        {{ tab.description }}
      </span>
    </section>

    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit">
        ログアウト
      </button>
    </router-link>
  </div>
</template>

<style scoped>
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
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.content {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.student-name:hover {
  color: #007bff;
}
</style>
