export interface AuthParams {
  username: string
  password: string
}

export interface ChangePasswordParams {
  id: string
  oldPassword: string
  newPassword: string
}

export interface StartSessionParams {
  id: string,
  pin: string
}