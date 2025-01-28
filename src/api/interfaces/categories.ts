export interface Category {
  id: string;
  id_company: string;
  id_branch: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  synced_at?: string;
}