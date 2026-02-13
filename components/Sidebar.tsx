
import React from 'react';
import { Sector, User } from '../types';
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardList, 
  Users, 
  Bell, 
  LogOut, 
  ShoppingCart,
  Layers
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentPage: string;
  setCurrentPage: (page: any) => void;
  onLogout: () => void;
  setSelectedSectorFilter: (sector: Sector | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, setCurrentPage, onLogout, setSelectedSectorFilter }) => {
  const isGestor = user.sector === Sector.GESTOR;
  const isComercial = user.sector === Sector.COMERCIAL;

  const sectors = [
    Sector.COMERCIAL, Sector.DESENHO, Sector.CIVIL, 
    Sector.MECANICA, Sector.ELETRICA, Sector.QUALIDADE, 
    Sector.MONTAGEM, Sector.CONCLUSAO
  ];

  const MenuItem = ({ icon: Icon, label, page, onClick, active }: any) => (
    <button
      onClick={onClick || (() => setCurrentPage(page))}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
        active 
          ? 'bg-red-700 text-white shadow-lg shadow-red-900/20' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-200 flex flex-col items-center gap-4">
        <img 
          src="https://aguiasistemas.com.br/wp-content/uploads/2022/10/logo-aguia-sistemas.svg" 
          alt="Águia Sistemas" 
          className="h-12 w-auto"
        />
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-800">Águia Sistema</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Inteligência Logística</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        {isGestor && (
          <>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-4 mt-4">Gestão Central</div>
            <MenuItem icon={LayoutDashboard} label="Dashboard Macro" page="DASHBOARD" active={currentPage === 'DASHBOARD'} />
            <MenuItem icon={Briefcase} label="Todos os Projetos" page="PROJECTS" active={currentPage === 'PROJECTS'} onClick={() => {
              setSelectedSectorFilter(null);
              setCurrentPage('PROJECTS');
            }} />
            <MenuItem icon={Users} label="Gestão de Usuários" page="USERS" active={currentPage === 'USERS'} />
            <MenuItem icon={Bell} label="Comunicados" page="ANNOUNCEMENTS" active={currentPage === 'ANNOUNCEMENTS'} />
            
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-4 mt-6">Setores da Esteira</div>
            <MenuItem icon={ShoppingCart} label="Central Comercial" page="COMMERCIAL" active={currentPage === 'COMMERCIAL'} />
            <div className="space-y-1 mt-2">
              {sectors.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSectorFilter(s);
                    setCurrentPage('SECTORS');
                  }}
                  className={`w-full text-left pl-11 pr-4 py-2 text-xs font-medium rounded-md transition-all ${
                    currentPage === 'SECTORS' && s === s // state logic check
                    ? 'text-red-700 bg-red-50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {!isGestor && (
          <>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-4 mt-4">Sua Operação</div>
            {isComercial && (
              <MenuItem icon={ShoppingCart} label="Hub Comercial" page="COMMERCIAL" active={currentPage === 'COMMERCIAL'} />
            )}
            <MenuItem icon={ClipboardList} label="Fila de Trabalho" page="SECTORS" active={currentPage === 'SECTORS'} />
            <MenuItem icon={Bell} label="Avisos do Gestor" page="ANNOUNCEMENTS" active={currentPage === 'ANNOUNCEMENTS'} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg"
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
