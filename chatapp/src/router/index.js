import { createRouter, createWebHistory } from "vue-router";
import Chat from "../components/Chat.vue";
import Login from "../components/Login.vue";
import student_list from "../components/student_list.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
    },
    {
      path: "/chat/",
      name: "chat",
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (from.name === "student_list") {
          next();
        } else {
          next({ name: "student_list" });
        }
      },
    },
    {
      path: "/student_list/",
      name: "student_list",
      component: student_list,
      beforeEnter: (to, from, next) => {
        if (from.name === "login" || from.name === "chat") {
          next();
        } else {
          next({ name: "login" });
        }
      },
    },
  ],
});

export default router;
