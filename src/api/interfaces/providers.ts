export interface Provider {
  id: string;
  id_company: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  tax_id?: string;
  notes?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
  synced_at?: Date;
}

export interface CreateProvider extends Omit<Provider, 'id' | 'status' | 'created_at' | 'updated_at' | 'synced_at'> { }