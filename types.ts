
export enum Sector {
  GESTOR = 'Gestor',
  COMERCIAL = 'Comercial',
  DESENHO = 'Desenho',
  CIVIL = 'Civil',
  MECANICA = 'Mecânica',
  ELETRICA = 'Elétrica',
  QUALIDADE = 'Qualidade',
  MONTAGEM = 'Montagem',
  CONCLUSAO = 'Conclusão'
}

export const SECTOR_ORDER: Sector[] = [
  Sector.COMERCIAL,
  Sector.DESENHO,
  Sector.CIVIL,
  Sector.MECANICA,
  Sector.ELETRICA,
  Sector.QUALIDADE,
  Sector.MONTAGEM,
  Sector.CONCLUSAO
];

export enum ProjectPriority {
  BAIXA = 'Baixa',
  MEDIA = 'Média',
  ALTA = 'Alta',
  URGENTE = 'Urgente'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  sector: Sector;
  isAdmin: boolean;
}

export interface ProjectHistory {
  id: string;
  sector: Sector;
  user: string;
  timestamp: string;
  action: 'ENTRY' | 'EXIT' | 'REJECTION';
  notes?: string;
}

export interface Project {
  id: string;
  clientName: string;
  requirements: string;
  deadline: string;
  priority: ProjectPriority;
  currentSector: Sector;
  status: 'ACTIVE' | 'FINISHED' | 'ON_HOLD';
  createdAt: string;
  history: ProjectHistory[];
  lastRejectionReason?: string;
  lastRejectionSector?: Sector;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  isLead: boolean; // true = potencial, false = ativo
  notes: string;
}

export interface Announcement {
  id: string;
  from: string;
  toUserId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}
