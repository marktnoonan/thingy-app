import { createApp } from "vue";
import App from "./App.vue";
import vue3_accessible_tabs from "vue3-accessible-tabs";
import { GesturePlugin } from '@vueuse/gesture'


createApp(App)
    .use(vue3_accessible_tabs)
    .use(GesturePlugin)
    .mount("#app");
