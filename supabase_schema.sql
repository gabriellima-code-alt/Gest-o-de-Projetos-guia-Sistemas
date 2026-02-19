-- =============================================
-- ÁGUIA SISTEMA - Schema SQL para Supabase
-- Execute no SQL Editor do Supabase
-- =============================================

-- Tabela de Perfis de Usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  sector TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_lead BOOLEAN DEFAULT true,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Projetos
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  requirements TEXT NOT NULL,
  deadline DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Média',
  current_sector TEXT NOT NULL DEFAULT 'Comercial',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  last_rejection_reason TEXT,
  last_rejection_sector TEXT,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies: qualquer usuário autenticado pode ler/escrever
-- (ajuste conforme sua necessidade de segurança)

CREATE POLICY "Allow all for authenticated" ON profiles
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON clients
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON projects
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- =============================================
-- Usuário Gestor padrão (para teste)
-- =============================================

INSERT INTO profiles (name, email, sector, is_admin)
VALUES ('Administrador', 'admin@company.com', 'Gestor', true)
ON CONFLICT (email) DO NOTHING;
