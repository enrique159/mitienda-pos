export const getBranchInfo = async (callback: any) => window.electron.getBranchInfo(callback)
export const setBranchLogo = async (setDefaultLogo: boolean = false, callback: any) => window.electron.setBranchLogo(setDefaultLogo, callback)
export const getBranchesByEmail = async (email: string, callback: any) => window.electron.getBranchesByEmail(email, callback)
