import CashRegisterModule from './CashRegisterModule.vue'
import CurrentCashRegisterStateView from './views/CurrentCashRegisterStateView.vue'

export const CashRegisterRoutes = [
  {
    path: '/main/cashregister',
    name: 'CashRegister',
    component: CashRegisterModule,
    redirect: { name: 'CurrentCashRegisterState' },
    children: [
      {
        path: 'current-state',
        name: 'CurrentCashRegisterState',
        component: CurrentCashRegisterStateView,
      },
    ],
  },
]