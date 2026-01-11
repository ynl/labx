import { supabase } from './supabase';
import { AICreation } from '../types/database';

export const aiCreationApi = {
  // Fetch all creations
  async getAll(category?: string, sortBy: 'created_at' | 'likes' = 'created_at') {
    let query = supabase
      .from('ai_creations')
      .select('*')
      .order(sortBy, { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data as AICreation[];
  },

  // Fetch a single creation by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('ai_creations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as AICreation;
  },

  // Create a new creation
  async create(creation: Omit<AICreation, 'id' | 'created_at' | 'likes'>) {
    const { data, error } = await supabase
      .from('ai_creations')
      .insert([creation])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as AICreation;
  },

  // Update a creation
  async update(id: string, updates: Partial<AICreation>) {
    const { data, error } = await supabase
      .from('ai_creations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as AICreation;
  },

  // Delete a creation
  async delete(id: string) {
    const { error } = await supabase
      .from('ai_creations')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  // Increment likes
  async incrementLikes(id: string) {
    const { error } = await supabase.rpc('increment_likes', {
      creation_id: id,
    });

    if (error) {
      throw error;
    }
  },

  // Search creations
  async search(searchTerm: string) {
    const { data, error } = await supabase
      .from('ai_creations')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as AICreation[];
  },
};
