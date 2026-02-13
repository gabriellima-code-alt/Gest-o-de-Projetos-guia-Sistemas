
import React, { useState } from 'react';
import { User, Client, Project, ChatMessage, Sector, ProjectPriority } from '../types';
import { MessageSquare, Send, UserPlus, FilePlus, Users, Briefcase, ChevronRight, Plus, X } from 'lucide-react';

interface CommercialHubProps {
  user: User;
  clients: Client[];
  projects: Project[];
  messages: ChatMessage[];
  onAddClient: (c: Omit<Client, 'id'>) => void;
  onAddProject: (p: any) => void;
  onSendMessage: (msg: string) => void;
}

const CommercialHub: React.FC<CommercialHubProps> = ({ user, clients, projects, messages, onAddClient, onAddProject, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<'CLIENTS' | 'CHAT'>('CLIENTS');
  const [chatInput, setChatInput] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Form states
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', isLead: true, notes: '' });
  const [newProject, setNewProject] = useState({ clientName: '', requirements: '', deadline: '', priority: ProjectPriority.MEDIA });

  const leads = clients.filter(c => c.isLead);
  const activeClients = clients.filter(c => !c.isLead);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onSendMessage(chatInput);
      setChatInput('');
    }
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient(newClient);
    setShowClientModal(false);
    setNewClient({ name: '', email: '', phone: '', isLead: true, notes: '' });
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject(newProject);
    setShowProjectModal(false);
    setNewProject({ clientName: '', requirements: '', deadline: '', priority: ProjectPriority.MEDIA });
  };

  const ClientCard = ({ client }: { client: Client }) => (
    <div 
      onClick={() => setSelectedClient(client)}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
          <Users size={20} />
        </div>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400" />
      </div>
      <h4 className="font-bold text-slate-800 mt-3">{client.name}</h4>
      <p className="text-xs text-slate-500 mt-1">{client.email}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {projects.filter(p => p.clientName === client.name).length} Projetos
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex bg-white rounded-lg p-1 border border-slate-200">
          <button 
            onClick={() => setActiveTab('CLIENTS')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'CLIENTS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Gestão de Clientes
          </button>
          <button 
            onClick={() => setActiveTab('CHAT')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'CHAT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Chat Comercial/Gestor
          </button>
        </div>

        {user.sector === Sector.COMERCIAL && activeTab === 'CLIENTS' && (
          <div className="flex gap-2">
            <button 
              onClick={() => setShowClientModal(true)}
              className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-all shadow-md shadow-slate-200"
            >
              <UserPlus size={16} /> Novo Cliente
            </button>
            <button 
              onClick={() => setShowProjectModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              <FilePlus size={16} /> Novo Projeto
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'CLIENTS' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-y-auto pr-2 pb-10">
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                Potenciais Clientes (Leads)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {leads.length > 0 ? leads.map(c => <ClientCard key={c.id} client={c} />) : <p className="text-xs text-slate-400 italic col-span-2">Nenhum potencial cliente cadastrado.</p>}
              </div>
            </section>
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Clientes com Projetos Ativos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeClients.length > 0 ? activeClients.map(c => <ClientCard key={c.id} client={c} />) : <p className="text-xs text-slate-400 italic col-span-2">Nenhum cliente ativo encontrado.</p>}
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-[600px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Comunicação Interna</h3>
                <p className="text-xs text-slate-500">Gestor & Comercial</p>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <MessageSquare size={40} className="mb-2" />
                  <p className="text-center text-sm">Nenhuma mensagem. Inicie a conversa!</p>
                </div>
              ) : messages.map(m => {
                const isMine = m.senderId === user.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMine ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                      {!isMine && <p className="text-[10px] font-bold mb-1 opacity-70">{m.senderName}</p>}
                      <p className="text-sm">{m.content}</p>
                      <p className={`text-[9px] mt-1 text-right ${isMine ? 'text-blue-100' : 'text-slate-400'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Digite sua mensagem para o Gestor..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal Cliente */}
      {showClientModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Cadastrar Cliente</h3>
              <button onClick={() => setShowClientModal(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddClientSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da Empresa</label>
                <input required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-mail</label>
                <input required type="email" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Telefone</label>
                  <input className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newClient.isLead ? 'true' : 'false'} onChange={e => setNewClient({...newClient, isLead: e.target.value === 'true'})}>
                    <option value="true">Lead (Potencial)</option>
                    <option value="false">Ativo (Contrato)</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all mt-4">Salvar Cliente</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Projeto */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Novo Projeto Comercial</h3>
              <button onClick={() => setShowProjectModal(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddProjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Selecionar Cliente</label>
                <select required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})}>
                  <option value="">Selecione...</option>
                  {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Escopo Técnico</label>
                <textarea required rows={3} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newProject.requirements} onChange={e => setNewProject({...newProject, requirements: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prazo</label>
                  <input required type="date" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prioridade</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" value={newProject.priority} onChange={e => setNewProject({...newProject, priority: e.target.value as ProjectPriority})}>
                    {Object.values(ProjectPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all mt-4">Iniciar Fluxo de Produção</button>
            </form>
          </div>
        </div>
      )}

      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedClient.name}</h3>
                <p className="text-slate-500">{selectedClient.email} • {selectedClient.phone}</p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-slate-400 text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Histórico de Projetos</h4>
              <div className="space-y-4">
                {projects.filter(p => p.clientName === selectedClient.name).length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
                    <Briefcase size={32} className="mx-auto mb-2 opacity-20" />
                    <p>Nenhum projeto registrado para este cliente.</p>
                  </div>
                ) : projects.filter(p => p.clientName === selectedClient.name).map(p => (
                  <div key={p.id} className="bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold text-slate-800">#{p.id.toUpperCase()}</p>
                      <p className="text-xs text-slate-500">{p.requirements.substring(0, 100)}...</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">{p.currentSector}</p>
                       <p className="text-[10px] text-slate-400 mt-1">Status: {p.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommercialHub;
