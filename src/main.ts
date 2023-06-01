import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

import { faLink, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faLink as IconDefinition)
library.add(faCircleXmark as IconDefinition)
library.add(faPlus as IconDefinition)
library.add(faMinus as IconDefinition)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
