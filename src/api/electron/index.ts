import { Area, AuthParams, Configuration, Documento, ChangePasswordParams, Actor, Activity, StartSessionParams } from '@/api/interfaces'

export const getVersion = async (callback: any) => window.electron.getVersion(callback)

/* Users */
export const getUsers = async (callback: any) => window.electron.getUsers(callback)
export const startSession = async (params: StartSessionParams, callback: any) => window.electron.startSession(params, callback)

/* Configuration */
export const getConfiguration = async (callback: any) => window.electron.getConfiguration(callback)
export const updateConfiguration = async (configuration: Configuration, callback: any) => window.electron.updateConfiguration(configuration, callback)
export const createConfiguration = async (configuration: Configuration, callback: any) => window.electron.createConfiguration(configuration, callback)
export const exportDatabase = async (callback: any) => window.electron.exportDatabase(callback)
export const importDatabase = async (data: any, callback: any) => window.electron.importDatabase(data, callback)

/* Auth */
export const signIn = async (auth: AuthParams, callback: any) => window.electron.signIn(auth, callback)
export const signUp = async (auth: AuthParams, callback: any) => window.electron.signUp(auth, callback)
export const changePassword = async (auth: ChangePasswordParams, callback: any) => window.electron.changePassword(auth, callback)

/* Areas */
export const getAreas = async (callback: any) => window.electron.getAreas(callback)
export const createArea = async (area: Partial<Area>, callback: any) => window.electron.createArea(area, callback)
export const updateArea = async (area: Area, callback: any) => window.electron.updateArea(area, callback)
export const deleteArea = async (idArea: string, callback: any) => window.electron.deleteArea(idArea, callback)

/* Actors */
export const getActors = async (callback: any) => window.electron.getActors(callback)
export const createActor = async (actor: Actor, callback: any) => window.electron.createActor(actor, callback)
export const deleteActor = async (actor: Actor, callback: any) => window.electron.deleteActor(actor, callback)


/* Documents */
export const getDocuments = async (callback: any) => window.electron.getDocuments(callback)
export const createDocument = async (document: Partial<Documento>, callback: any) => window.electron.createDocument(document, callback)
export const openDocument = async (params: { documentRoute: string, openFolder?: boolean }, callback: any) => window.electron.openDocument(params, callback)
export const deleteDocument = async (id: string, callback: any) => window.electron.deleteDocument(id, callback)

/* Activities */
export const getActivities = async (id: string, callback: any) => window.electron.getActivities(id, callback)
export const createActivity = async (activity: Activity, callback: any) => window.electron.createActivity(activity, callback)