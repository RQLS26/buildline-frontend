/**
 * Main Application Entry Point
 * @description Bootstraps the Vue 3 application with PrimeVue, Pinia, Router, and i18n.
 * @author RQLS TEAM
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import i18n from './i18n';
import router from './router.js';
import pinia from './pinia.js';
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'

import {
    Button, Card, Checkbox, Column, ConfirmDialog, DataTable, DatePicker, Dialog, Drawer,
    FileUpload, FloatLabel, IconField, InputIcon, InputNumber, InputText,
    Menu, Rating, Row, Select, SelectButton, Tag, Toast, Textarea, Toolbar, Tooltip, MultiSelect, ToggleSwitch
} from "primevue"
import Chart from 'primevue/chart';

createApp(App)
    .use(i18n)
    .use(PrimeVue, {
        theme: {
            preset: Material,
            options: {
                darkModeSelector: '.app-dark-mode'
            }
        },
        ripple: true
    })
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-chart', Chart)
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-checkbox', Checkbox)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-data-table', DataTable)
    .component('pv-date-picker', DatePicker)
    .component('pv-dialog', Dialog)
    .component('pv-drawer', Drawer)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-icon-field', IconField)
    .component('pv-input-icon', InputIcon)
    .component('pv-input-number', InputNumber)
    .component('pv-input-text', InputText)
    .component('pv-menu', Menu)
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-tag', Tag)
    .component('pv-toast', Toast)
    .component('pv-textarea', Textarea)
    .component('pv-toolbar', Toolbar)
    .component('pv-tooltip', Tooltip)
    .component('pv-multi-select', MultiSelect)
    .component('pv-toggle-switch', ToggleSwitch)
    .use(pinia)
    .use(router)
    .mount('#app')
