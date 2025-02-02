import ProductsModule from './ProductsModule.vue'
import ProductsView from './views/ProductsView.vue'
import CreateProductView from './views/CreateProductView.vue'
import TaxesView from './views/TaxesView.vue'

export const ProductsRoutes = [
  {
    path: '/main/products',
    name: 'Products',
    redirect: { name: 'ProductsView' },
    component: ProductsModule,
    children: [
      {
        path: '',
        name: 'ProductsView',
        component: ProductsView,
      },
      {
        path: 'create',
        name: 'CreateProductView',
        component: CreateProductView,
      },
      {
        path: 'taxes',
        name: 'TaxesView',
        component: TaxesView,
      },
    ],
  },
]
