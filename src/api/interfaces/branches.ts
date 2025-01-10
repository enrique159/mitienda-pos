export interface Branch {
  id: string; // ID único de la sucursal
  id_company: string; // ID único de la compañía a la que pertenece
  branch_alias: string; // Alias o nombre corto de la sucursal
  branch_name: string; // Nombre completo de la sucursal
  is_main: boolean; // Indica si es la sucursal principal
  logo: string; // URL del logo de la sucursal
  pin: string; // Código PIN asociado a la sucursal
  pin_enabled: boolean; // Indica si el PIN está habilitado
  ticket_config: JSON; // Configuración de tickets (header y footer)
  timezone: string; // Zona horaria de la sucursal
  created_at: string; // Fecha de creación (formato ISO 8601)
  updated_at: string; // Fecha de última actualización (formato ISO 8601)
  synced_at: string | null; // Fecha de sincronización o `null` si no se ha sincronizado
}