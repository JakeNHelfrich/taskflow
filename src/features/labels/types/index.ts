export interface Label {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface CreateLabelInput {
  name: string
  color?: string
}

export interface UpdateLabelInput {
  name?: string
  color?: string
}
