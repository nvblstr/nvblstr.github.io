import { createApp } from 'vue'
import App from './App.vue'
import {
  BContainer,
  BRow,
  BCol,
  BFormGroup,
  BFormRadioGroup,
  BFormSpinbutton,
} from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import './style.css'

const app = createApp(App)

app.component('BContainer', BContainer)
app.component('BRow', BRow)
app.component('BCol', BCol)
app.component('BFormGroup', BFormGroup)
app.component('BFormRadioGroup', BFormRadioGroup)
app.component('BFormSpinbutton', BFormSpinbutton)

app.mount('#app')
