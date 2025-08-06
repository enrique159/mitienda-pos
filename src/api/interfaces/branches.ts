export interface Branch {
  id: string; // ID único de la sucursal
  id_company: string; // ID único de la compañía a la que pertenece
  branch_alias: string; // Alias o nombre corto de la sucursal
  branch_name: string; // Nombre completo de la sucursal
  is_main: boolean; // Indica si es la sucursal principal
  logo: string; // URL del logo de la sucursal
  pin: string; // Código PIN asociado a la sucursal
  pin_enabled: boolean; // Indica si el PIN está habilitado
  ticket_config: TicketConfig; // Configuración de tickets (header y footer)
  timezone: string; // Zona horaria de la sucursal
  pin_cancel_sale_required: boolean; // Indica si se requiere PIN para cancelar ventas
  pin_cancel_sale: string; // Código PIN para cancelar ventas
  created_at: string; // Fecha de creación (formato ISO 8601)
  updated_at: string; // Fecha de última actualización (formato ISO 8601)
  synced_at?: string; // Fecha de sincronización o `null` si no se ha sincronizado
}

export interface TicketConfig {
  invoice_info?: {
    invoice_instructions: string;
    invoice_url: string;
    qr_code: string;
  },
  footer_info?: {
    thank_you_message: string;
    business_url: string;
  }
}