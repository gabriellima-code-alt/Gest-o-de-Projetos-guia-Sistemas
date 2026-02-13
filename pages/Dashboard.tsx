
import React, { useState } from 'react';
import { Project, Sector, SECTOR_ORDER, ProjectPriority, User } from '../types';
import { SECTOR_COLORS, PRIORITY_COLORS } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Plus, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  user: User;
  onAddProject: (p: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, user, onAddProject }) => {
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    clientName: '',
    requirements: '',
    deadline: '',
    priority: ProjectPriority.MEDIA
  });

  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  const finishedProjects = projects.filter(p => p.status === 'FINISHED');

  const sectorCounts = SECTOR_ORDER.map(sector => ({
    name: sector,
    count: activeProjects.filter(p => p.currentSector === sector).length,
    color: SECTOR_COLORS[sector]
  }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject(newProject);
    setShowModal(false);
    setNewProject({ clientName: '', requirements: '', deadline: '', priority: ProjectPriority.MEDIA });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Executivo</h2>
          <p className="text-slate-500">Visão geral da esteira de produção e gargalos.</p>
        </div>
        {user.sector === Sector.GESTOR && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Novo Projeto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Ativos</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeProjects.length}</p>
          <p className="text-sm text-slate-500 mt-1">Projetos em curso</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Finalizados</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{finishedProjects.length}</p>
          <p className="text-sm text-slate-500 mt-1">Concluídos este mês</p>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Distribuição por Prioridade</p>
           <div className="flex gap-4">
             {Object.values(ProjectPriority).map(prio => (
               <div key={prio} className="flex-1 text-center">
                 <div className={`py-1 rounded-full text-[10px] font-bold mb-2 ${PRIORITY_COLORS[prio]}`}>
                   {prio}
                 </div>
                 <span className="text-xl font-bold">{activeProjects.filter(p => p.priority === prio).length}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Carga por Setor (Gargalos)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorCounts}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {sectorCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 3 ? '#ef4444' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Cadastrar Novo Projeto</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                <input 
                  required
                  type="text" 
                  value={newProject.clientName}
                  onChange={e => setNewProject({...newProject, clientName: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                  placeholder="Nome da empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Requisitos Técnicos</label>
                <textarea 
                  required
                  rows={3}
                  value={newProject.requirements}
                  onChange={e => setNewProject({...newProject, requirements: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                  placeholder="Descreva o escopo..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prazo Final</label>
                  <input 
                    required
                    type="date" 
                    value={newProject.deadline}
                    onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                  <select 
                    value={newProject.priority}
                    onChange={e => setNewProject({...newProject, priority: e.target.value as ProjectPriority})}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  >
                    {Object.values(ProjectPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Criar Projeto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
