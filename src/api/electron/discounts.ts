import { Response, CreateDiscount, Discount, UpdateDiscount } from '@/api/interfaces'

export const getDiscounts = async (callback: any): Promise<Response<Discount[]>> => window.electron.getDiscounts(callback)
export const createDiscount = async (data: CreateDiscount, callback: any) => window.electron.createDiscount(data, callback)
export const updateDiscount = async (discount: UpdateDiscount, callback: any) => window.electron.updateDiscount(discount, callback)
export const deleteDiscount = async (discountId: string, callback: any) => window.electron.deleteDiscount(discountId, callback)
export const getDiscountProducts = async (discountId: string, callback: any) => window.electron.getDiscountProducts(discountId, callback)
export const attachProductsToDiscount = async (discountId: string, productsId: Array<string>, callback: any) => window.electron.createDiscountProduct(discountId, productsId, callback)
