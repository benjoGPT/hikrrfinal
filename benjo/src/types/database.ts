export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface Hike {
  id: string
  user_id: string
  title: string
  description: string | null
  distance_km: number
  elevation_gain_m: number
  elevation_max_m: number
  duration_min: number
  date: string
  location: string | null
  cover_image_url: string | null
  route_data: unknown
  created_at: string
}

export interface Photo {
  id: string
  user_id: string
  hike_id: string | null
  url: string
  caption: string | null
  taken_at: string | null
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  hike_id: string | null
  title: string
  content: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  user_id: string
  title: string
  description: string | null
  target_date: string | null
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme' | null
  status: 'wishlist' | 'planned' | 'completed'
  created_at: string
}
