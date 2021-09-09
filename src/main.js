import Vue from "vue";
import App from "./App.vue";

// bootstrap-vueからBootstrapVue,IconPluginをインポートする
import { BootstrapVue, IconsPlugin } from "bootstrap-vue"; // add

// Bootstrap と BootstrapVueのCSSファイルをインポート（順序はBootstrap⇒BootstrapVue）
//import "bootstrap/dist/css/bootstrap.css"; // add
//import "bootstrap-vue/dist/bootstrap-vue.css"; // add
import "./assets/bootstrap-custom.scss"

// BootstrapVueをプロジェクト全体で利用できるようにする
Vue.use(BootstrapVue); // add

// BootstrapVueアイコンコンポーネントプラグインの使用
Vue.use(IconsPlugin); // add

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
