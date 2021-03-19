// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
//
// createApp(App).use(router).mount('#app')



import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';

createApp(App).use(VueMaterial).use(router).mount('#app')
