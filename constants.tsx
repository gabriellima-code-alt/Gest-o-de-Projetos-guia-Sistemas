
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Bell, 
  Filter, 
  Plus, 
  Trash2, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';

export const SECTOR_COLORS: Record<string, string> = {
  Comercial: 'bg-blue-100 text-blue-700 border-blue-200',
  Desenho: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Civil: 'bg-amber-100 text-amber-700 border-amber-200',
  Mecânica: 'bg-orange-100 text-orange-700 border-orange-200',
  Elétrica: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Qualidade: 'bg-purple-100 text-purple-700 border-purple-200',
  Montagem: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Conclusão: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const PRIORITY_COLORS: Record<string, string> = {
  Baixa: 'bg-slate-100 text-slate-700',
  Média: 'bg-blue-100 text-blue-700',
  Alta: 'bg-orange-100 text-orange-700',
  Urgente: 'bg-red-100 text-red-700',
};
