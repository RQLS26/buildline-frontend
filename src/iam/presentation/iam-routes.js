/**
 * IAM Routes
 * @description Route definitions for the Identity & Access Management bounded context.
 * @author RQLS TEAM
 */
import SignIn from './views/sign-in.vue';
import SignUp from './views/sign-up.vue';
import ForgotPassword from './views/forgot-password.vue';

const iamRoutes = [
    { path: 'sign-in', name: 'sign-in', component: SignIn, meta: { title: 'Sign In' } },
    { path: 'sign-up', name: 'sign-up', component: SignUp, meta: { title: 'Sign Up' } },
    { path: 'forgot-password', name: 'forgot-password', component: ForgotPassword, meta: { title: 'Forgot Password' } }
];
export default iamRoutes;
