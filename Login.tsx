import React, { useState } from 'react';
import { Sector } from '../types';
import { Mail, Lock, UserCircle, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<string | null>;
  onSignUp: (data: { name: string; email: string; password: string; sector: Sector }) => Promise<string | null>;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignUp }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState<Sector>(Sector.COMERCIAL);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await onLogin(email, password);
    setLoading(false);
    if (err) setError('Credenciais inválidas. Verifique seu e-mail e senha.');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await onSignUp({ name, email, password, sector });
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setSuccessMsg('Conta criada! Verifique seu e-mail para confirmar o cadastro, depois faça login.');
      setIsRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/5 rounded-full blur-3xl -ml-64 -mb-64"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="bg-[#003366] p-6 rounded-3xl shadow-xl shadow-slate-200 mb-6 flex justify-center">
            <img
              src="https://aguiasistemas.com.br/wp-content/uploads/2023/07/logo-white.svg"
              alt="Águia Sistemas"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Águia Sistema</h1>
          <p className="text-slate-500">Gestão integrada da esteira industrial.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => { setIsRegister(false); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-sm font-bold transition-all border-b-2 ${!isRegister ? 'border-red-600 text-red-600' : 'border-transparent text-slate-400'}`}
            >
              ENTRAR
            </button>
            <button
              onClick={() => { setIsRegister(true); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-sm font-bold transition-all border-b-2 ${isRegister ? 'border-red-600 text-red-600' : 'border-transparent text-slate-400'}`}
            >
              CADASTRAR
            </button>
          </div>

          {successMsg && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={isRegister ? handleSignUp : handleLogin} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                <div className="relative">
                  <UserCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Setor Responsável</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value as Sector)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    {Object.values(Sector).filter(s => s !== Sector.GESTOR).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-6 hover:bg-red-700 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {isRegister ? 'Finalizar Cadastro' : 'Acessar Sistema'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Acesso de Teste (Gestor):</p>
              <p className="text-xs text-slate-600">
                Email: <span className="font-bold">admin@company.com</span> / Senha: <span className="font-bold">admin123</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">* Crie este usuário no painel Supabase Auth</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
