import AuthModule from './AuthModule.vue';
import LoginView from './views/LoginView.vue';
import SignInAsUserView from './views/SignInAsUserView.vue';

export const AuthRoutes = [
  {
    path: '/auth',
    redirect: '/auth/login',
    component: AuthModule,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
      },
      {
        path: 'signin-as-user',
        name: 'SignInAsUser',
        component: SignInAsUserView,
      }
    ],
  },
]