export interface Documento {
  id?: string
  fecha: Date
  numero_oficio: string
  enviado_por: string
  cargo: string
  asunto: string
  dirigido_a: string
  documento: any
  area_id: string
  area?: string
  user_id?: string
  created_at?: Date
}

export interface Activity {
  id?: string
  accion: string
  descripcion: string
  user_id?: string
  document_id?: string
  created_at?: Date
}