-- =============================================
-- ÁGUIA SISTEMA - SQL FINAL CORRIGIDO
-- Execute no SQL Editor do Supabase
-- =============================================

-- 1. Adiciona colunas faltantes na profiles (sem email - ela usa auth.users)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Adiciona coluna history na tabela projects (estava faltando)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS history JSONB DEFAULT '[]'::jsonb;

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Remove policies antigas se existirem
DROP POLICY IF EXISTS "Allow all for authenticated" ON profiles;
DROP POLICY IF EXISTS "Allow all for authenticated" ON clients;
DROP POLICY IF EXISTS "Allow all for authenticated" ON projects;
DROP POLICY IF EXISTS "Allow all" ON profiles;
DROP POLICY IF EXISTS "Allow all" ON clients;
DROP POLICY IF EXISTS "Allow all" ON projects;

-- Cria policies limpas
CREATE POLICY "Allow all" ON profiles
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all" ON clients
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all" ON projects
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- =============================================
-- Usuário Gestor padrão para login de teste
-- IMPORTANTE: O email fica no auth.users, não em profiles
-- Use o Supabase Auth > Users > "Add User" para criar:
--   Email: admin@company.com  /  Senha: admin123
-- Depois execute este INSERT com o UUID gerado:
-- =============================================

-- Após criar o usuário no painel Auth, rode:
-- INSERT INTO profiles (id, name, sector, is_admin)
-- VALUES ('<UUID_DO_USUARIO_AUTH>', 'Administrador', 'Gestor', true)
-- ON CONFLICT (id) DO UPDATE SET name='Administrador', sector='Gestor', is_admin=true;
