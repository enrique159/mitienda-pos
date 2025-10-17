import { CreateProduct } from '@/api/interfaces'
import { UpdateProduct } from '../interfaces/products'

export const getProducts = async (callback: any) => window.electron.getActiveProducts(callback)
export const getAllProducts = async (callback: any) => window.electron.getProducts(callback)
export const getProductsByCategory = async (categoryId: string , callback: any) => window.electron.getProductsByCategory(categoryId, callback)
export const createProduct = async (product: CreateProduct, callback: any) => window.electron.createProduct(product, callback)
export const updateProduct = async (product: UpdateProduct, callback: any) => window.electron.updateProduct(product, callback)
export const deleteProduct = async (productId: string, callback: any) => window.electron.deleteProduct(productId, callback)
