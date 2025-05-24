import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {
    BContainer,
    BRow,
    BCol,
    BFormGroup,
    BFormRadioGroup,
    BFormSpinbutton,
    BCard,
    createBootstrap
} from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)

// bootstrap-vue-nextのプラグインを設定
app.use(createBootstrap())

// コンポーネントの登録
app.component('BContainer', BContainer)
app.component('BRow', BRow)
app.component('BCol', BCol)
app.component('BFormGroup', BFormGroup)
app.component('BFormRadioGroup', BFormRadioGroup)
app.component('BFormSpinbutton', BFormSpinbutton)
app.component('BCard', BCard)

app.mount('#app')
