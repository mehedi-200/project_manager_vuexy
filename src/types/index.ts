export interface Project {
  id: number
  name: string
  description?: string
  start_date?: string
  deadline?: string
  status: { value: number; label: string }
  is_active: 0 | 1
  owner?: { id: number; name: string }
  created_by?: { id: number; name: string }
  features_count?: number
  progress?: number
}

export interface Phase {
  id: number
  project_id: number
  name: string
  order_number: number
}

export interface Feature {
  id: number
  project_id: number
  title: string
  description?: string
  status: { value: number; label: string }
  priority: { value: number; label: string }
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  estimated_hours?: number
  actual_hours?: number | null
  order?: number
  is_active: boolean
  created_by?: { id: number; name: string }
  updated_by?: { id: number; name: string }
  created_at?: string
  updated_at?: string
}

export interface Member {
  id: number
  user_id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'developer' | 'viewer'
}

export interface ChecklistItem {
  id: number
  title: string
  is_completed: boolean
}

export interface Comment {
  id: number
  user: { id: number; name: string }
  comment: string
  created_at: string
}
