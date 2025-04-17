/*
 * @Author: bc-ax 1542650614@qq.com
 * @Date: 2025-03-07 13:12:25
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 14:42:11
 * @FilePath: \demo\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './assets/main.css'
import './assets/styles/route-page.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// main.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'highlight.js/styles/github.css' // 或其他主题
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
