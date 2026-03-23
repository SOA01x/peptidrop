-- Supabase Database Schema for Peptidrop v2.0
-- Run this in the Supabase SQL Editor
-- If upgrading from v1, run the ALTER statements at the bottom instead

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  credits INTEGER DEFAULT 0 NOT NULL,
  plan TEXT DEFAULT 'free' NOT NULL CHECK (plan IN ('free', 'pro', 'premium')),
  plan_expires_at TIMESTAMPTZ,
  favorites TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- PROTOCOLS TABLE
-- ============================================
CREATE TABLE public.protocols (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal TEXT NOT NULL,
  gender TEXT,
  input JSONB NOT NULL,
  protocol JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  current_week INTEGER DEFAULT 1,
  credits_used INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own protocols"
  ON public.protocols FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own protocols"
  ON public.protocols FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own protocols"
  ON public.protocols FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PROGRESS ENTRIES TABLE
-- ============================================
CREATE TABLE public.progress_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  protocol_id UUID REFERENCES public.protocols(id) ON DELETE CASCADE NOT NULL,
  week INTEGER NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  adjustments TEXT,
  side_effects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON public.progress_entries FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- SAVED STACKS TABLE
-- ============================================
CREATE TABLE public.saved_stacks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  peptide_ids TEXT[] NOT NULL,
  node_positions JSONB,
  synergy_score DECIMAL(3,1),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.saved_stacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own stacks"
  ON public.saved_stacks FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('subscription', 'report', 'credits')),
  plan TEXT,
  amount_usd DECIMAL(10,2),
  charge_id TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- CLINICAL REPORTS TABLE
-- ============================================
CREATE TABLE public.clinical_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  protocol_id UUID REFERENCES public.protocols(id),
  report_type TEXT NOT NULL,
  pdf_url TEXT,
  amount_paid DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.clinical_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON public.clinical_reports FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits, plan)
  VALUES (NEW.id, NEW.email, 0, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if upgrading
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_protocols_user_id ON public.protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_protocols_created_at ON public.protocols(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_protocols_status ON public.protocols(status);
CREATE INDEX IF NOT EXISTS idx_progress_protocol ON public.progress_entries(protocol_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_stacks_user_id ON public.saved_stacks(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.clinical_reports(user_id);

-- ============================================
-- v1 → v2 MIGRATION (run these if upgrading)
-- ============================================
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
-- ALTER TABLE public.protocols ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
-- ALTER TABLE public.protocols ADD COLUMN IF NOT EXISTS current_week INTEGER DEFAULT 1;
-- ALTER TABLE public.protocols ADD COLUMN IF NOT EXISTS gender TEXT;
