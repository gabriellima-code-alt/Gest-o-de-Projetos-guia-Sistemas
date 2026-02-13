
import React, { useState } from 'react';
import { User, Sector } from '../types';
import { Mail, Lock, UserCircle, Briefcase, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onSignUp: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignUp, users }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState<Sector>(Sector.COMERCIAL);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = users.find(u => u.email === email && (u.password || '123') === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Use o e-mail institucional.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Informe um e-mail institucional válido.');
      return;
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      sector,
      isAdmin: sector === Sector.GESTOR
    };
    onSignUp(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
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
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold transition-all border-b-2 ${!isRegister ? 'border-red-600 text-red-600' : 'border-transparent text-slate-400'}`}
            >
              ENTRAR
            </button>
            <button 
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-bold transition-all border-b-2 ${isRegister ? 'border-red-600 text-red-600' : 'border-transparent text-slate-400'}`}
            >
              CADASTRAR
            </button>
          </div>

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
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail Institucional</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="exemplo@aguiasistemas.com.br"
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
                  placeholder="••••••••"
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

            {error && <p className="text-xs font-medium text-red-500 mt-2">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-6 hover:bg-red-700 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group"
            >
              {isRegister ? 'Finalizar Cadastro' : 'Acessar Sistema'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {!isRegister && (
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Acesso de Teste (Gestor):</p>
               <p className="text-xs text-slate-600">Email: <span className="font-bold">admin@company.com</span> / Senha: <span className="font-bold">admin</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
