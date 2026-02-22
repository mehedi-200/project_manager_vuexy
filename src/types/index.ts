export interface Project {
  id: number
  name: string
  description?: string
  start_date?: string
  deadline?: string
  is_active: 0 | 1
  features_count?: number
  completed_features_count?: number
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
  phase_id?: number
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'done'
  estimated_hours?: number
  day_number?: number
  serial_number?: number
  dependency_feature_id?: number | null
  checklist?: ChecklistItem[]
  comments?: Comment[]
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
