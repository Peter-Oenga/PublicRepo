import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import './assets/styles/tailwind.css'; // Import your Tailwind CSS file
import { FontAwesomeIcon } from './fontawesome';
import store from './store';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(store);
app.use(router);

app.mount('#app');
