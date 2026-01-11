-- AI Creativity Showcase Database Schema
-- This file contains the SQL commands to set up your Supabase database

-- Create the ai_creations table
create table if not exists public.ai_creations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text not null,
  image_url text not null,
  category text not null,
  tags text[] default '{}',
  ai_model text not null,
  prompt text,
  likes integer default 0,
  author text
);

-- Enable Row Level Security (RLS)
alter table public.ai_creations enable row level security;

-- Create policies for public read access
create policy "Allow public read access"
  on public.ai_creations
  for select
  using (true);

-- Create policies for insert (can be adjusted based on your auth requirements)
create policy "Allow public insert"
  on public.ai_creations
  for insert
  with check (true);

-- Create policies for update (can be adjusted based on your auth requirements)
create policy "Allow public update"
  on public.ai_creations
  for update
  using (true);

-- Create policies for delete (can be adjusted based on your auth requirements)
create policy "Allow public delete"
  on public.ai_creations
  for delete
  using (true);

-- Create indexes for better query performance
create index if not exists ai_creations_created_at_idx on public.ai_creations(created_at desc);
create index if not exists ai_creations_category_idx on public.ai_creations(category);
create index if not exists ai_creations_likes_idx on public.ai_creations(likes desc);

-- Create a function to increment likes
create or replace function increment_likes(creation_id uuid)
returns void
language plpgsql
as $$
begin
  update public.ai_creations
  set likes = likes + 1
  where id = creation_id;
end;
$$;

-- Insert some sample data (optional)
insert into public.ai_creations (title, description, image_url, category, tags, ai_model, prompt, author)
values
  (
    'Cyberpunk City Sunset',
    '一个充满未来感的赛博朋克城市，在夕阳下的景象',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    'art',
    array['cyberpunk', 'city', 'sunset', 'futuristic'],
    'Midjourney',
    'cyberpunk city at sunset, neon lights, futuristic architecture, ultra detailed',
    'AI Artist'
  ),
  (
    'Fantasy Forest Guardian',
    '一个梦幻森林中的守护者，充满魔法和神秘感',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
    'illustration',
    array['fantasy', 'forest', 'magic', 'guardian'],
    'DALL-E',
    'mystical forest guardian, magical atmosphere, ethereal lighting',
    'Digital Dreamer'
  ),
  (
    'Abstract Digital Art',
    '抽象的数字艺术作品，色彩丰富，层次分明',
    'https://images.unsplash.com/photo-1549887534-1541e9326642',
    'design',
    array['abstract', 'digital', 'colorful', 'modern'],
    'Stable Diffusion',
    'abstract digital art, vibrant colors, geometric patterns',
    'Pixel Master'
  );
