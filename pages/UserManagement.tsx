
import React from 'react';
import { User, Sector } from '../types';
import { Trash2, UserCheck, ShieldAlert, Mail } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onDeleteUser: (id: string) => void;
  user: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onDeleteUser, user }) => {
  if (user.sector !== Sector.GESTOR) return <div>Acesso Negado</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Controle de Acessos</h2>
          <p className="text-slate-500">Gerencie quem tem acesso ao sistema e suas permissões setoriais.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
            <div className="flex items-start justify-between">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${u.isAdmin ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                {u.isAdmin ? <ShieldAlert size={24} /> : <UserCheck size={24} />}
              </div>
              {u.id !== user.id && (
                <button 
                  onClick={() => onDeleteUser(u.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-4">{u.name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <Mail size={12} /> {u.email}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Setor</p>
                <p className="text-sm font-semibold text-blue-600">{u.sector}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${u.isAdmin ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                {u.isAdmin ? 'ADMINISTRADOR' : 'OPERACIONAL'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
