import SignIn from './views/sign-in.vue';
import SignUp from './views/sign-up.vue';

const iamRoutes = [
    { path: 'sign-in', name: 'sign-in', component: SignIn, meta: { title: 'Sign In' } },
    { path: 'sign-up', name: 'sign-up', component: SignUp, meta: { title: 'Sign Up' } } // Faltaba registrar la ruta
];

export default iamRoutes;