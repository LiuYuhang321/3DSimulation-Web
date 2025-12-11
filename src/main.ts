import {createApp} from 'vue'
import App from './App.vue'
import router from "./router"
import '@/styles/index.scss'
import CF3D from "@/libs/cf3d/index.js";
import store from './store'
import { showTilte, hideTitle, ellipsis } from "@/utils/TitleUtil"
import "@/utils/rem"

window.cf3d = new CF3D.CFMap();

const app = createApp(App);


app.use(router);
app.use(store);
app.config.globalProperties.$showTilte = showTilte;
app.config.globalProperties.$hideTitle = hideTitle;
app.config.globalProperties.$ellipsis = ellipsis;
app.mount('#app');
