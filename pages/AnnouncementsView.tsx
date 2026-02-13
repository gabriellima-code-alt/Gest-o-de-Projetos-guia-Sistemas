
import React, { useState } from 'react';
import { Announcement, User, Sector } from '../types';
import { Bell, Send, UserCircle, Clock } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  user: User;
  users: User[];
  onSend: (ann: any) => void;
}

const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements, user, users, onSend }) => {
  const [content, setContent] = useState('');
  const [targetId, setTargetId] = useState('ALL');

  const isGestor = user.sector === Sector.GESTOR;
  const filteredAnnouncements = isGestor 
    ? announcements 
    : announcements.filter(a => a.toUserId === 'ALL' || a.toUserId === user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend({ toUserId: targetId, content });
      setContent('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Central de Comunicados</h2>
        <p className="text-slate-500">Avisos importantes e ordens de serviço diretas.</p>
      </div>

      {isGestor && (
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm shadow-blue-50">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bell className="text-blue-600" size={18} />
            Enviar Novo Comunicado
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Destinatário</label>
                <select 
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                >
                  <option value="ALL">Todos os Usuários</option>
                  {users.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.sector})</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mensagem</label>
              <textarea 
                rows={3}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Ex: Reunião urgente para o setor de Desenho às 14h..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Send size={16} /> Disparar Aviso
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Nenhum aviso no momento.</div>
        ) : filteredAnnouncements.map(a => (
          <div key={a.id} className={`p-6 rounded-2xl border bg-white shadow-sm flex gap-4 ${a.toUserId === 'ALL' ? 'border-amber-100' : 'border-slate-100'}`}>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${a.toUserId === 'ALL' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">{a.from}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    Para: {a.toUserId === 'ALL' ? 'Todos' : 'Você'}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock size={10} /> {new Date(a.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{a.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsView;
