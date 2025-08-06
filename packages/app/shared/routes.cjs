const finish = (string, end) =>
  string.endsWith(end) ? string : `${string}${end}`
const finishSlash = (string) => finish(string, '/')

// CONFIGURATION ROUTES
const initialConfiguration = (baseUrl) => `${finishSlash(baseUrl)}pos/install`
// COMPANY ROUTES
const getBranchesByEmail = (baseUrl) => `${finishSlash(baseUrl)}companies/branches`

// AUTH ROUTES
// const signIn = (baseUrl) => `${finishSlash(baseUrl)}auth/signin`
// const signOut = (baseUrl) => `${finishSlash(baseUrl)}auth/signout`
// const check = (baseUrl) => `${finishSlash(baseUrl)}auth/check`
// USERS ROUTES
// const signUp = (baseUrl) => `${finishSlash(baseUrl)}users`
// // COMPANIES ROUTES
// const createCompany = (baseUrl) => `${finishSlash(baseUrl)}companies`
// const updateCompany = (baseUrl, companyId) =>
//   `${finishSlash(baseUrl)}companies/${companyId}`
// const uploadCompanyImage = (baseUrl, companyId) =>
//   `${finishSlash(baseUrl)}companies/${companyId}/upload-image`
// const getCompany = (baseUrl, companyId) =>
//   `${finishSlash(baseUrl)}companies/${companyId}`
// const getUserCompany = (baseUrl) =>
//   `${finishSlash(baseUrl)}companies/company-by-user`
// // BRANCHES ROUTES
// const createBranch = (baseUrl) => `${finishSlash(baseUrl)}branches`
// const uploadBranchImage = (baseUrl, branchId) =>
//   `${finishSlash(baseUrl)}branches/${branchId}/upload-image`
// const updateBranch = (baseUrl, branchId) =>
//   `${finishSlash(baseUrl)}branches/${branchId}`
// const getBranch = (baseUrl, branchId) =>
//   `${finishSlash(baseUrl)}branches/${branchId}`
// const getBranches = (baseUrl) => `${finishSlash(baseUrl)}branches`
// const getBranchesList = (baseUrl) =>
//   `${finishSlash(baseUrl)}branches/list`
// // POS ROUTES
// const createPos = (baseUrl) => `${finishSlash(baseUrl)}pos`
// const getPos = (baseUrl) => `${finishSlash(baseUrl)}pos`
// const getPosById = (baseUrl, posId) =>
//   `${finishSlash(baseUrl)}pos/${posId}`
// const getPosList = (baseUrl, branchId) =>
//   `${finishSlash(baseUrl)}pos/${branchId}/list`
// const getOnePos = (baseUrl, branchId, posId) =>
//   `${finishSlash(baseUrl)}pos/${branchId}/${posId}`
// const updatePos = (baseUrl, posId) =>
//   `${finishSlash(baseUrl)}pos/${posId}`

// // SELLERS ROUTES
// const createSeller = (baseUrl) => `${finishSlash(baseUrl)}sellers`
// const getSellers = (baseUrl) => `${finishSlash(baseUrl)}sellers`
// const updateSellerPos = (baseUrl, sellerId) =>
//   `${finishSlash(baseUrl)}sellers/${sellerId}/update-pos`

exports.finish = finish
exports.finishSlash = finishSlash

module.exports = {
  // CONFIGURATION ROUTES
  initialConfiguration,
  // COMPANY ROUTES
  getBranchesByEmail,
}
