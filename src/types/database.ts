export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ai_creations: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image_url: string
          category: string
          tags: string[]
          ai_model: string
          prompt?: string
          likes: number
          author?: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image_url: string
          category: string
          tags?: string[]
          ai_model: string
          prompt?: string
          likes?: number
          author?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image_url?: string
          category?: string
          tags?: string[]
          ai_model?: string
          prompt?: string
          likes?: number
          author?: string
        }
      }
    }
  }
}

export type AICreation = Database['public']['Tables']['ai_creations']['Row'];
