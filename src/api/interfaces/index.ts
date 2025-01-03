import { AuthParams, ChangePasswordParams, StartSessionParams } from './auth'
import { Area } from './areas'
import { Documento, Activity } from './documents'
import { Configuration } from './configuration'
import { Actor } from './actors'
import { User } from './users'

interface Response<T> {
  success: boolean
  message: string
  response: T
}

export type {
  User,
  Area, 
  Actor, 
  Response,
  Activity,
  Documento,
  AuthParams,
  Configuration, 
  StartSessionParams,
  ChangePasswordParams,
}
