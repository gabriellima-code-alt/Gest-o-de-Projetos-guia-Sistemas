
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sector, 
  User, 
  Project, 
  SECTOR_ORDER, 
  ProjectPriority, 
  Client, 
  Announcement, 
  ChatMessage 
} from './types';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import SectorQueue from './pages/SectorQueue';
import CommercialHub from './pages/CommercialHub';
import UserManagement from './pages/UserManagement';
import AnnouncementsView from './pages/AnnouncementsView';

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Gestor Master', email: 'admin@company.com', sector: Sector.GESTOR, isAdmin: true, password: 'admin' },
  { id: '2', name: 'João Comercial', email: 'joao@comercial.com', sector: Sector.COMERCIAL, isAdmin: false },
  { id: '3', name: 'Alice Qualidade', email: 'alice@qualidade.com', sector: Sector.QUALIDADE, isAdmin: false }
];

const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Fábrica Alpha', email: 'contato@alpha.com', phone: '11 9999-9999', isLead: false, notes: 'Cliente recorrente.' },
  { id: 'c2', name: 'Construtora Beta', email: 'lead@beta.com', phone: '11 8888-8888', isLead: true, notes: 'Interessado em estrutura metálica.' }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<'DASHBOARD' | 'PROJECTS' | 'SECTORS' | 'COMMERCIAL' | 'USERS' | 'ANNOUNCEMENTS'>('DASHBOARD');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<Sector | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.sector === Sector.COMERCIAL) setCurrentPage('COMMERCIAL');
    else if (user.sector !== Sector.GESTOR) setCurrentPage('SECTORS');
    else setCurrentPage('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('DASHBOARD');
  };

  const handleSignUp = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    handleLogin(newUser);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addProject = (p: Omit<Project, 'id' | 'createdAt' | 'history' | 'status' | 'currentSector'>) => {
    const newProject: Project = {
      ...p,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      currentSector: Sector.COMERCIAL,
      history: [{
        id: Math.random().toString(36).substr(2, 9),
        sector: Sector.COMERCIAL,
        user: currentUser?.name || 'Sistema',
        timestamp: new Date().toISOString(),
        action: 'ENTRY'
      }]
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const advanceProject = (projectId: string, notes?: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      
      let nextSector: Sector | undefined;

      // Regra 1: Se o projeto estava em correção (rejeitado), ele volta direto para a QUALIDADE
      if (proj.lastRejectionSector) {
        nextSector = Sector.QUALIDADE;
      } 
      // Regra 2: Se a QUALIDADE aprova, vai direto para MONTAGEM
      else if (proj.currentSector === Sector.QUALIDADE) {
        nextSector = Sector.MONTAGEM;
      }
      // Regra 3: Fluxo Linear normal
      else {
        const currentIndex = SECTOR_ORDER.indexOf(proj.currentSector);
        nextSector = SECTOR_ORDER[currentIndex + 1];
      }

      if (!nextSector) return { ...proj, status: 'FINISHED' as const };

      // Se chegamos no último setor da lista (Conclusão), marcamos como finalizado
      const isFinished = nextSector === Sector.CONCLUSAO;

      return {
        ...proj,
        currentSector: nextSector,
        status: isFinished ? 'FINISHED' as const : 'ACTIVE' as const,
        lastRejectionReason: undefined,
        lastRejectionSector: undefined, // Limpa o estado de correção ao avançar
        history: [...proj.history, {
          id: Math.random().toString(36).substr(2, 9),
          sector: nextSector,
          user: currentUser?.name || 'Operador',
          timestamp: new Date().toISOString(),
          action: 'EXIT',
          notes
        }]
      };
    }));
  };

  const rejectProject = (projectId: string, reason: string, targetSector?: Sector) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      
      // Se não for especificado, volta para o anterior, mas o requisito pede seletor
      const fallbackSector = proj.history[proj.history.length - 2]?.sector || Sector.COMERCIAL;
      const destination = targetSector || fallbackSector;

      return {
        ...proj,
        currentSector: destination,
        lastRejectionReason: reason,
        lastRejectionSector: Sector.QUALIDADE, // Marca que veio da Qualidade para saber onde voltar
        history: [...proj.history, {
          id: Math.random().toString(36).substr(2, 9),
          sector: destination,
          user: currentUser?.name || 'Qualidade',
          timestamp: new Date().toISOString(),
          action: 'REJECTION',
          notes: reason
        }]
      };
    }));
  };

  const addClient = (c: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...c,
      id: Math.random().toString(36).substr(2, 9)
    };
    setClients(prev => [...prev, newClient]);
  };

  const sendAnnouncement = (ann: Omit<Announcement, 'id' | 'timestamp' | 'read' | 'from'>) => {
    setAnnouncements(prev => [{
      ...ann,
      id: Math.random().toString(36).substr(2, 9),
      from: currentUser?.name || 'Gestor',
      timestamp: new Date().toISOString(),
      read: false
    }, ...prev]);
  };

  const sendChatMessage = (content: string) => {
    setChatMessages(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser?.id || '0',
      senderName: currentUser?.name || 'User',
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} onSignUp={handleSignUp} users={users} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        user={currentUser} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        setSelectedSectorFilter={setSelectedSectorFilter}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={currentUser} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          {currentPage === 'DASHBOARD' && <Dashboard projects={projects} user={currentUser} onAddProject={addProject} />}
          {currentPage === 'PROJECTS' && <ProjectsList projects={projects} user={currentUser} initialSectorFilter={selectedSectorFilter} />}
          {currentPage === 'SECTORS' && (
            <SectorQueue 
              projects={projects} 
              user={currentUser} 
              onAdvance={advanceProject} 
              onReject={rejectProject}
              sector={currentUser.isAdmin ? (selectedSectorFilter || Sector.COMERCIAL) : currentUser.sector}
            />
          )}
          {currentPage === 'COMMERCIAL' && (
            <CommercialHub 
              user={currentUser} 
              projects={projects} 
              clients={clients} 
              onAddClient={addClient} 
              onAddProject={addProject}
              messages={chatMessages}
              onSendMessage={sendChatMessage}
            />
          )}
          {currentPage === 'USERS' && <UserManagement users={users} onDeleteUser={deleteUser} user={currentUser} />}
          {currentPage === 'ANNOUNCEMENTS' && (
            <AnnouncementsView 
              announcements={announcements} 
              user={currentUser} 
              onSend={sendAnnouncement}
              users={users}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
