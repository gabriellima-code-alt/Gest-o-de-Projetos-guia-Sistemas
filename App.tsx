
import React, { useState, useEffect } from 'react';
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
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import SectorQueue from './pages/SectorQueue';
import CommercialHub from './pages/CommercialHub';
import UserManagement from './pages/UserManagement';
import AnnouncementsView from './pages/AnnouncementsView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPage, setCurrentPage] = useState<'DASHBOARD' | 'PROJECTS' | 'SECTORS' | 'COMMERCIAL' | 'USERS' | 'ANNOUNCEMENTS'>('DASHBOARD');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<Sector | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregamento inicial de dados do Banco SQL
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Busca Projetos
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (projData) setProjects(projData as any);

      // Busca Clientes
      const { data: clientData } = await supabase
        .from('clients')
        .select('*');
      if (clientData) setClients(clientData);

      // Busca Perfis de Usuários
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*');
      if (profileData) setUsers(profileData as any);

      setLoading(false);
    };

    fetchData();
    
    // Inscrição em Tempo Real para Projetos
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.sector === Sector.COMERCIAL) setCurrentPage('COMMERCIAL');
    else if (user.sector !== Sector.GESTOR) setCurrentPage('SECTORS');
    else setCurrentPage('DASHBOARD');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentPage('DASHBOARD');
  };

  const handleSignUp = async (newUser: User) => {
    // No Supabase real, usaríamos supabase.auth.signUp
    // Aqui simulamos a inserção no banco SQL
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        sector: newUser.sector, 
        is_admin: newUser.isAdmin 
      }]);
    
    if (!error) {
      setUsers(prev => [...prev, newUser]);
      handleLogin(newUser);
    }
  };

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addProject = async (p: any) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        client_name: p.clientName,
        requirements: p.requirements,
        deadline: p.deadline,
        priority: p.priority,
        current_sector: Sector.COMERCIAL,
        status: 'ACTIVE'
      }])
      .select();

    if (!error && data) {
      // O useEffect cuidará da atualização via Realtime ou fetch
    }
  };

  const advanceProject = async (projectId: string, notes?: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    let nextSector: Sector | undefined;
    if (proj.lastRejectionSector) {
      nextSector = Sector.QUALIDADE;
    } else if (proj.currentSector === Sector.QUALIDADE) {
      nextSector = Sector.MONTAGEM;
    } else {
      const currentIndex = SECTOR_ORDER.indexOf(proj.currentSector);
      nextSector = SECTOR_ORDER[currentIndex + 1];
    }

    const isFinished = nextSector === Sector.CONCLUSAO || !nextSector;

    await supabase
      .from('projects')
      .update({
        current_sector: nextSector || Sector.CONCLUSAO,
        status: isFinished ? 'FINISHED' : 'ACTIVE',
        last_rejection_reason: null,
        last_rejection_sector: null
      })
      .eq('id', projectId);
  };

  const rejectProject = async (projectId: string, reason: string, targetSector?: Sector) => {
    await supabase
      .from('projects')
      .update({
        current_sector: targetSector,
        last_rejection_reason: reason,
        last_rejection_sector: Sector.QUALIDADE
      })
      .eq('id', projectId);
  };

  const addClient = async (c: any) => {
    const { error } = await supabase
      .from('clients')
      .insert([c]);
    
    if (!error) {
      // Refresh local data
      const { data } = await supabase.from('clients').select('*');
      if (data) setClients(data);
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} onSignUp={handleSignUp} users={users} />;
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mb-4"></div>
        <p className="text-slate-500 font-medium">Sincronizando com Águia Database...</p>
      </div>
    );
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
              onSendMessage={(msg) => console.log('Chat via Supabase a implementar')}
            />
          )}
          {currentPage === 'USERS' && <UserManagement users={users} onDeleteUser={deleteUser} user={currentUser} />}
          {currentPage === 'ANNOUNCEMENTS' && (
            <AnnouncementsView 
              announcements={announcements} 
              user={currentUser} 
              onSend={(ann) => console.log('Avisos via Supabase a implementar')}
              users={users}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
