import ProductsModule from './ProductsModule.vue'
import ProductsView from './views/ProductsView.vue'
import CreateProductView from './views/CreateProductView.vue'
import TaxesView from './views/TaxesView.vue'
import CategoriesView from './views/CategoriesView.vue'
import DiscountsView from './views/DiscountsView.vue'
import ProvidersView from './views/ProvidersView.vue'
import ExampleGeminiView from './views/ExampleGeminiView.vue'

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
      {
        path: 'categories',
        name: 'CategoriesView',
        component: CategoriesView,
      },
      {
        path: 'discounts',
        name: 'DiscountsView',
        component: DiscountsView,
      },
      {
        path: 'providers',
        name: 'ProvidersView',
        component: ProvidersView,
      },
    ],
  },
]
