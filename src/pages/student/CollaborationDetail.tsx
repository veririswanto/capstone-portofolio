
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { User, Briefcase, MessageSquare, Check, X, Clock } from 'lucide-react';

interface CollaborationDetailData {
  id: string;
  judul_proyek: string;
  deskripsi: string;
  pesan_detail: string;
  status: 'pending' | 'accepted' | 'rejected';
  lecturer_name: string; 
}

const CollaborationDetail: React.FC = () => {
  const { collaborationId } = useParams<{ collaborationId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [collaboration, setCollaboration] = useState<CollaborationDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchCollaborationDetail = useCallback(async () => {
    if (!collaborationId) {
      setError("ID Kolaborasi tidak ditemukan.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
     
      const response = await api.get(`/kolaborasi/${collaborationId}`);
      setCollaboration(response.data);
    } catch (err) {
      console.error("Gagal mengambil detail kolaborasi:", err);
      setError("Tidak dapat memuat detail undangan kolaborasi. Mungkin sudah tidak valid.");
    } finally {
      setIsLoading(false);
    }
  }, [collaborationId]);

  useEffect(() => {
    fetchCollaborationDetail();
  }, [fetchCollaborationDetail]);

  
  const handleRespond = async (response: 'accepted' | 'rejected') => {
    setIsResponding(true);
    try {
     
      await api.put(`/kolaborasi/${collaborationId}/respond`, { status: response });
      alert(`Anda telah ${response === 'accepted' ? 'menerima' : 'menolak'} undangan kolaborasi ini.`);
      navigate('/student/kolaborasi'); 
    } catch (err) {
      console.error("Gagal merespons undangan:", err);
      alert("Gagal mengirim respons. Silakan coba lagi.");
    } finally {
      setIsResponding(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat detail undangan...</div>;
  }
  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h2>
        <p className="text-slate-500 mt-2">{error}</p>
      </div>
    );
  }
  if (!collaboration) {
    return <div className="p-8 text-center text-slate-500">Undangan tidak ditemukan.</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
         
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-8 text-white">
            <h1 className="text-3xl font-bold">Undangan Kolaborasi Proyek</h1>
            <p className="text-teal-100 mt-1">Anda diundang untuk bergabung dalam proyek berikut:</p>
          </div>

         
          <div className="p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-lg text-teal-600"><Briefcase size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Judul Proyek</p>
                <p className="text-lg font-bold text-slate-800">{collaboration.judul_proyek}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-lg text-slate-600"><User size={24} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Dosen Pengajak</p>
                <p className="text-lg font-semibold text-slate-800">{collaboration.lecturer_name}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Deskripsi Proyek</p>
              <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border">{collaboration.deskripsi}</p>
            </div>
            {collaboration.pesan_detail && (
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Pesan dari Dosen</p>
                <div className="text-slate-600 bg-slate-50 p-4 rounded-lg border flex items-start gap-3">
                  <MessageSquare size={18} className="text-slate-400 mt-1 flex-shrink-0" />
                  <p className="italic">"{collaboration.pesan_detail}"</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50/70 border-t">
            {collaboration.status === 'pending' ? (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <p className="text-sm font-semibold text-slate-600">Apakah Anda tertarik untuk bergabung?</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleRespond('rejected')}
                    disabled={isResponding}
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-white border border-red-300 text-red-600 font-bold hover:bg-red-50 disabled:opacity-50"
                  >
                    <X size={16} /> Tolak
                  </button>
                  <button
                    onClick={() => handleRespond('accepted')}
                    disabled={isResponding}
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 disabled:opacity-50"
                  >
                    <Check size={16} /> Terima
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2 font-semibold text-lg">
                {collaboration.status === 'accepted' 
                  ? <span className="text-green-600 flex items-center gap-2"><Check size={20}/> Undangan Diterima</span> 
                  : <span className="text-red-600 flex items-center gap-2"><X size={20}/> Undangan Ditolak</span>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationDetail;