export const getCategories = async (callback: any) => window.electron.getCategories(callback)
export const createCategory = async (data: any, callback: any) => window.electron.createCategory(data, callback)
export const updateCategory = async (data: any, callback: any) => window.electron.updateCategory(data, callback)
export const deleteCategory = async (id: string, callback: any) => window.electron.deleteCategory(id, callback)
