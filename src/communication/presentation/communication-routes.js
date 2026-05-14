import MessagesInbox from './views/messages-inbox.vue';

const communicationRoutes = [
    { path: 'messages', name: 'messages-inbox', component: MessagesInbox, meta: { title: 'Comunicaciones' } }
];

export default communicationRoutes;