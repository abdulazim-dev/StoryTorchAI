-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE project_status AS ENUM ('active', 'archived', 'completed');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'studio');
CREATE TYPE character_role AS ENUM ('protagonist', 'antagonist', 'supporting', 'minor');

-- Profiles table (for user data)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  monthly_chapter_credits INTEGER DEFAULT 5,
  monthly_image_credits INTEGER DEFAULT 30,
  credits_used_this_month INTEGER DEFAULT 0,
  images_used_this_month INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (stories) table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  tone TEXT DEFAULT 'anime',
  status project_status DEFAULT 'active',
  story_memory JSONB DEFAULT '{"characters": [], "locations": [], "timeline": [], "key_facts": []}'::jsonb,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  chapter_number INTEGER NOT NULL,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, chapter_number)
);

-- Characters table
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  role character_role DEFAULT 'supporting',
  appearance TEXT,
  personality TEXT,
  backstory TEXT,
  relationships JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline events table
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, event_order)
);

-- AI prompts log table
CREATE TABLE public.prompts_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  prompt_type TEXT NOT NULL,
  input_prompt TEXT NOT NULL,
  output_text TEXT,
  model_used TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for chapters
CREATE POLICY "Users can view own chapters"
  ON public.chapters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create chapters in own projects"
  ON public.chapters FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own chapters"
  ON public.chapters FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own chapters"
  ON public.chapters FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

-- RLS Policies for characters
CREATE POLICY "Users can view own characters"
  ON public.characters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = characters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create characters in own projects"
  ON public.characters FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = characters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own characters"
  ON public.characters FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = characters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own characters"
  ON public.characters FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = characters.project_id
    AND projects.user_id = auth.uid()
  ));

-- Similar policies for locations and timeline_events
CREATE POLICY "Users can view own locations"
  ON public.locations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = locations.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own locations"
  ON public.locations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = locations.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can view own timeline events"
  ON public.timeline_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = timeline_events.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own timeline events"
  ON public.timeline_events FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = timeline_events.project_id
    AND projects.user_id = auth.uid()
  ));

-- RLS Policies for prompts_log
CREATE POLICY "Users can view own prompt logs"
  ON public.prompts_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own prompt logs"
  ON public.prompts_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();