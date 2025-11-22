// List of permissions
export const Permission = Object.freeze({
  SELL: 1,
  CANCEL_SELL: 2,
  CREATE_CUSTOMER: 4,
  UPDATE_CUSTOMER: 8,
  DELETE_CUSTOMER: 16,
  CREATE_PRODUCT: 32,
  UPDATE_PRODUCT: 64,
  DELETE_PRODUCT: 128,
  CREATE_CATEGORY: 256,
  UPDATE_CATEGORY: 512,
  DELETE_CATEGORY: 1024,
  CREATE_DISCOUNT: 2048,
  UPDATE_DISCOUNT: 4096,
  DELETE_DISCOUNT: 8192,
  SEE_PURCHASE_ORDERS: 16384,
  CREATE_PURCHASE_ORDER: 32768,
  UPDATE_PURCHASE_ORDER: 65536,
  DELETE_PURCHASE_ORDER: 131072,
  SEE_PROVIDERS: 262144,
  CREATE_PROVIDER: 524288,
  UPDATE_PROVIDER: 1048576,
  DELETE_PROVIDER: 2097152,
  SEE_INVENTORIES: 4194304,
  CREATE_INVENTORY: 8388608,
  UPDATE_INVENTORY: 16777216,
  DELETE_INVENTORY: 33554432,
  SEE_SALES: 67108864,
  SEE_REPORTS: 134217728,
  SEE_CASH_REGISTERS: 268435456,
  // TODO: Add more permissions
})

const UserTypesDefault = Object.freeze({
  SELLER: 67108865, // VALOR SUMADO DE LOS PERMISOS RELACIONADOS A VENTAS
  ADMIN: 536870911, // VALOR SUMADO DE TODOS LOS PERMISOS
})

export const checkPermission = (permission: number, mask: number) =>
  (permission & mask) > 0
export const checkPermissions = (permissions: number[], mask: number) =>
  permissions.some((permission) => checkPermission(permission, mask))

export const userType = (permissions: number) => {
  if (permissions === 0) return { label: 'Sin permisos', level: 0 }
  if (permissions <= UserTypesDefault.SELLER)
    return { label: 'Vendedor', level: 1 }
  if (permissions < UserTypesDefault.ADMIN)
    return { label: 'Usuario', level: 2 }
  if (permissions === UserTypesDefault.ADMIN)
    return { label: 'Administrador', level: 3 }
  return { label: 'Desconocido', level: 0 }
}

// DEFAULT ROLES
export const DEFAULT_ROLES = [
  {
    label: 'Vendedor',
    value: UserTypesDefault.SELLER,
  },
  {
    label: 'Administrador',
    value: UserTypesDefault.ADMIN,
  },
]

export const PERMISSIONS_LIST = [
  {
    label: 'Realizar ventas',
    value: Permission.SELL,
    group: 'ventas',
  },
  {
    label: 'Cancelar ventas',
    value: Permission.CANCEL_SELL,
    group: 'ventas',
  },
  {
    label: 'Crear cliente',
    value: Permission.CREATE_CUSTOMER,
    group: 'clientes',
  },
  {
    label: 'Actualizar cliente',
    value: Permission.UPDATE_CUSTOMER,
    group: 'clientes',
  },
  {
    label: 'Eliminar cliente',
    value: Permission.DELETE_CUSTOMER,
    group: 'clientes',
  },
  {
    label: 'Crear producto',
    value: Permission.CREATE_PRODUCT,
    group: 'productos',
  },
  {
    label: 'Actualizar producto',
    value: Permission.UPDATE_PRODUCT,
    group: 'productos',
  },
  {
    label: 'Eliminar producto',
    value: Permission.DELETE_PRODUCT,
    group: 'productos',
  },
  {
    label: 'Crear categoría',
    value: Permission.CREATE_CATEGORY,
    group: 'productos',
  },
  {
    label: 'Actualizar categoría',
    value: Permission.UPDATE_CATEGORY,
    group: 'productos',
  },
  {
    label: 'Eliminar categoría',
    value: Permission.DELETE_CATEGORY,
    group: 'productos',
  },
  {
    label: 'Crear descuento',
    value: Permission.CREATE_DISCOUNT,
    group: 'ventas',
  },
  {
    label: 'Actualizar descuento',
    value: Permission.UPDATE_DISCOUNT,
    group: 'ventas',
  },
  {
    label: 'Eliminar descuento',
    value: Permission.DELETE_DISCOUNT,
    group: 'ventas',
  },
  {
    label: 'Ver órdenes de compra',
    value: Permission.SEE_PURCHASE_ORDERS,
    group: 'compras',
  },
  {
    label: 'Crear orden de compra',
    value: Permission.CREATE_PURCHASE_ORDER,
    group: 'compras',
  },
  {
    label: 'Actualizar orden de compra',
    value: Permission.UPDATE_PURCHASE_ORDER,
    group: 'compras',
  },
  {
    label: 'Eliminar orden de compra',
    value: Permission.DELETE_PURCHASE_ORDER,
    group: 'compras',
  },
  {
    label: 'Ver proveedores',
    value: Permission.SEE_PROVIDERS,
    group: 'proveedores',
  },
  {
    label: 'Crear proveedor',
    value: Permission.CREATE_PROVIDER,
    group: 'proveedores',
  },
  {
    label: 'Actualizar proveedor',
    value: Permission.UPDATE_PROVIDER,
    group: 'proveedores',
  },
  {
    label: 'Eliminar proveedor',
    value: Permission.DELETE_PROVIDER,
    group: 'proveedores',
  },
  {
    label: 'Ver inventarios',
    value: Permission.SEE_INVENTORIES,
    group: 'inventario',
  },
  {
    label: 'Crear inventario',
    value: Permission.CREATE_INVENTORY,
    group: 'inventario',
  },
  {
    label: 'Actualizar inventario',
    value: Permission.UPDATE_INVENTORY,
    group: 'inventario',
  },
  {
    label: 'Eliminar inventario',
    value: Permission.DELETE_INVENTORY,
    group: 'inventario',
  },
  {
    label: 'Ver ventas',
    value: Permission.SEE_SALES,
    group: 'ventas',
  },
  {
    label: 'Ver reportes',
    value: Permission.SEE_REPORTS,
    group: 'reportes',
  },
  {
    label: 'Ver cajas registradoras',
    value: Permission.SEE_CASH_REGISTERS,
    group: 'cajas',
  },
]
