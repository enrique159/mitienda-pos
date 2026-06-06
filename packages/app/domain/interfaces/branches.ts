import type { CreateEntity, JsonColumn, Timestamp, UUID, UpdateEntity } from './common.js'

export interface TicketConfig {
  invoice_info?: {
    invoice_instructions: string
    invoice_url: string
    qr_code: string
  }
  footer_info?: {
    thank_you_message: string
    business_url: string
  }
}

export interface Branch {
  id: UUID
  id_company: UUID
  branch_name: string
  branch_alias: string
  is_main: boolean
  pin_enabled: boolean
  pin: string | null
  logo: string | null
  ticket_config: JsonColumn<TicketConfig>
  timezone: string
  pin_cancel_sale_required: boolean
  pin_cancel_sale: string | null
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export interface BranchSeller {
  id: UUID
  id_branch: UUID
  id_seller: UUID
  created_at: Timestamp
}

export type CreateBranch = CreateEntity<Branch, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateBranch = UpdateEntity<Branch>
export type CreateBranchSeller = CreateEntity<BranchSeller, 'id' | 'created_at'>
