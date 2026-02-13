
import React, { useState } from 'react';
import { Project, Sector, User } from '../types';
import { SECTOR_COLORS, PRIORITY_COLORS } from '../constants';
import { Filter, Calendar, User as UserIcon, History, Search } from 'lucide-react';

interface ProjectsListProps {
  projects: Project[];
  user: User;
  initialSectorFilter: Sector | null;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, user, initialSectorFilter }) => {
  const [sectorFilter, setSectorFilter] = useState<Sector | 'TODOS'>(initialSectorFilter || 'TODOS');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'FINISHED' | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchSector = sectorFilter === 'TODOS' || p.currentSector === sectorFilter;
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchDate = !dateFilter || p.createdAt.startsWith(dateFilter);
    const matchSearch = p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSector && matchStatus && matchDate && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar por cliente..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <select 
            value={sectorFilter} 
            onChange={e => setSectorFilter(e.target.value as any)}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
          >
            <option value="TODOS">Todos os Setores</option>
            {Object.values(Sector).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as any)}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
          >
            <option value="ALL">Status: Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="FINISHED">Concluídos</option>
          </select>
          <input 
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Projeto / Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Setor Atual</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Prioridade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Lançamento</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Responsável Atual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Nenhum projeto encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : filteredProjects.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{p.clientName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">ID: {p.id.toUpperCase()}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${SECTOR_COLORS[p.currentSector]}`}>
                    {p.currentSector}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[p.priority]}`}>
                    {p.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <UserIcon size={14} />
                    {p.history[p.history.length - 1]?.user || 'Não atribuído'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsList;
