/**
 * Communication Routes
 * @description Route definitions for the Communication bounded context.
 * @author RQLS TEAM
 */
import MessagesInbox from './views/messages-inbox.vue';

const communicationRoutes = [
    { path: 'messages', name: 'messages-inbox', component: MessagesInbox, meta: { title: 'Notifications' } }
];

export default communicationRoutes;
