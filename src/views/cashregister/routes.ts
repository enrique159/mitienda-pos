import CashRegisterModule from './CashRegisterModule.vue'
import CurrentCashRegisterStateView from './views/CurrentCashRegisterStateView.vue'
import MovementsCashRegisterView from './views/MovementsCashRegisterView.vue'
import CloseCashRegisterView from './views/CloseCashRegister.vue'
import HistoryCashRegisterView from './views/HistoryCashRegister.vue'
import CashRegisterDetailsView from './views/CashRegisterDetails.vue'

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
      {
        path: 'movements',
        name: 'MovementsCashRegister',
        component: MovementsCashRegisterView,
      },
      {
        path: 'close',
        name: 'CloseCashRegister',
        component: CloseCashRegisterView,
      },
      {
        path: 'history',
        name: 'HistoryCashRegister',
        component: HistoryCashRegisterView,
      },
      {
        path: 'details/:id',
        name: 'CashRegisterDetails',
        component: CashRegisterDetailsView,
      },
    ],
  },
]