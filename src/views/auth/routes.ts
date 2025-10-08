import AuthModule from './AuthModule.vue'
import LoginView from './views/LoginView.vue'
import SignInAsUserView from './views/SignInAsUserView.vue'
import InitialConfigView from './views/InitialConfigView.vue'
import StartingView from './views/StartingView.vue'
import SyncingView from './views/SyncingView.vue'

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
      },
      {
        path: 'initial-config',
        name: 'InitialConfig',
        component: InitialConfigView,
      },
      {
        path: 'syncing',
        name: 'Syncing',
        component: SyncingView,
      },
      {
        path: 'starting',
        name: 'Starting',
        component: StartingView,
      },
    ],
  },
]