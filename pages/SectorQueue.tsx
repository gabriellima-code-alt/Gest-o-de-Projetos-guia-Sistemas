
import React, { useState } from 'react';
import { Project, Sector, User, SECTOR_ORDER } from '../types';
import { SECTOR_COLORS, PRIORITY_COLORS } from '../constants';
import { AlertCircle, CheckCircle2, XCircle, ArrowRight, MessageSquare, Info, Clock, History } from 'lucide-react';

interface SectorQueueProps {
  projects: Project[];
  user: User;
  onAdvance: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string, targetSector?: Sector) => void;
  sector: Sector;
}

const SectorQueue: React.FC<SectorQueueProps> = ({ projects, user, onAdvance, onReject, sector }) => {
  const [rejectionModal, setRejectionModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [targetSector, setTargetSector] = useState<Sector>(Sector.DESENHO);

  const queue = projects.filter(p => p.currentSector === sector && p.status === 'ACTIVE');
  const isQuality = sector === Sector.QUALIDADE;

  const handleReject = () => {
    if (rejectionModal && rejectionReason) {
      onReject(rejectionModal, rejectionReason, targetSector);
      setRejectionModal(null);
      setRejectionReason('');
    }
  };

  // Setores que podem falhar antes da qualidade
  const rejectableSectors = [
    Sector.COMERCIAL,
    Sector.DESENHO,
    Sector.CIVIL,
    Sector.MECANICA,
    Sector.ELETRICA
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fila: {sector}</h2>
          <p className="text-slate-500">Projetos aguardando sua ação para avançar na esteira.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
          {queue.length} Projetos em Fila
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {queue.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
            <CheckCircle2 size={48} className="mb-4 text-slate-200" />
            <p className="text-lg font-medium">Tudo limpo por aqui!</p>
            <p className="text-sm">Novos projetos aparecerão conforme avançarem nas etapas anteriores.</p>
          </div>
        ) : (
          queue.map(p => {
            const isCorrection = p.lastRejectionReason !== undefined;
            return (
              <div key={p.id} className={`bg-white rounded-xl border p-6 shadow-sm flex flex-col md:flex-row gap-6 ${isCorrection ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'}`}>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{p.clientName}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PRIORITY_COLORS[p.priority]}`}>
                          {p.priority}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{p.id.toUpperCase()}</span>
                      </div>
                    </div>
                    {isCorrection && (
                      <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100 animate-pulse">
                        <AlertCircle size={14} />
                        EM CORREÇÃO
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                    <p className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <Info size={14} /> Requisitos:
                    </p>
                    {p.requirements}
                  </div>

                  {isCorrection && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <p className="text-xs font-bold text-red-600 uppercase mb-1">Motivo da Recusa:</p>
                      <p className="text-sm text-red-800">{p.lastRejectionReason}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1"><Clock size={14}/> Lançado em: {new Date(p.createdAt).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><History size={14}/> Etapa: {SECTOR_ORDER.indexOf(p.currentSector) + 1} de {SECTOR_ORDER.length}</span>
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-center gap-3">
                  {isQuality ? (
                    <>
                      <button 
                        onClick={() => onAdvance(p.id)}
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Aprovar para Montagem
                      </button>
                      <button 
                        onClick={() => setRejectionModal(p.id)}
                        className="w-full bg-white text-red-600 border border-red-200 py-3 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />
                        Reprovar Projeto
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => onAdvance(p.id)}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
                    >
                      {isCorrection ? 'Corrigido - Voltar para Qualidade' : 'Finalizar Etapa'}
                      <ArrowRight size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {rejectionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-red-50">
              <h3 className="text-xl font-bold text-red-800 flex items-center gap-2">
                <AlertCircle className="text-red-600" />
                Registrar Reprovação
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Setor que falhou:</label>
                <select 
                  value={targetSector}
                  onChange={e => setTargetSector(e.target.value as Sector)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {rejectableSectors.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo detalhado:</label>
                <textarea 
                  required
                  rows={4}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500/20"
                  placeholder="Ex: Erro no dimensionamento da carga elétrica identificado no Desenho..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setRejectionModal(null)} className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors">Cancelar</button>
                <button 
                  onClick={handleReject}
                  disabled={!rejectionReason}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg shadow-red-100"
                >
                  Enviar para Correção
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorQueue;
