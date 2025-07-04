<<<<<<< HEAD

=======
>>>>>>> cd61495 (sampai sini)
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
<<<<<<< HEAD
import { User, Briefcase, MessageSquare, Check, X, Clock } from 'lucide-react';
=======
import { User, Briefcase, MessageSquare, Check, X } from 'lucide-react';
>>>>>>> cd61495 (sampai sini)

interface CollaborationDetailData {
  id: string;
  judul_proyek: string;
  deskripsi: string;
  pesan_detail: string;
  status: 'pending' | 'accepted' | 'rejected';
<<<<<<< HEAD
  lecturer_name: string; 
=======
  lecturer_name: string;
>>>>>>> cd61495 (sampai sini)
}

const CollaborationDetail: React.FC = () => {
  const { collaborationId } = useParams<{ collaborationId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [collaboration, setCollaboration] = useState<CollaborationDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD

=======
>>>>>>> cd61495 (sampai sini)
  const fetchCollaborationDetail = useCallback(async () => {
    if (!collaborationId) {
      setError("ID Kolaborasi tidak ditemukan.");
      setIsLoading(false);
      return;
    }
<<<<<<< HEAD
    
    setIsLoading(true);
    try {
     
=======

    setIsLoading(true);
    try {
>>>>>>> cd61495 (sampai sini)
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

<<<<<<< HEAD
  
  const handleRespond = async (response: 'accepted' | 'rejected') => {
    setIsResponding(true);
    try {
     
      await api.put(`/kolaborasi/${collaborationId}/respond`, { status: response });
      alert(`Anda telah ${response === 'accepted' ? 'menerima' : 'menolak'} undangan kolaborasi ini.`);
      navigate('/student/kolaborasi'); 
=======
  const handleRespond = async (response: 'accepted' | 'rejected') => {
    setIsResponding(true);
    try {
      await api.put(`/kolaborasi/${collaborationId}/respond`, { status: response });
      alert(`Anda telah ${response === 'accepted' ? 'menerima' : 'menolak'} undangan kolaborasi ini.`);
      navigate('/student/kolaborasi');
>>>>>>> cd61495 (sampai sini)
    } catch (err) {
      console.error("Gagal merespons undangan:", err);
      alert("Gagal mengirim respons. Silakan coba lagi.");
    } finally {
      setIsResponding(false);
    }
  };

  if (isLoading) {
<<<<<<< HEAD
    return <div className="p-8 text-center text-slate-500">Memuat detail undangan...</div>;
  }
=======
    return <div className="p-8 text-center text-slate-500 animate-pulse">Memuat detail undangan...</div>;
  }

>>>>>>> cd61495 (sampai sini)
  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan</h2>
        <p className="text-slate-500 mt-2">{error}</p>
      </div>
    );
  }
<<<<<<< HEAD
=======

>>>>>>> cd61495 (sampai sini)
  if (!collaboration) {
    return <div className="p-8 text-center text-slate-500">Undangan tidak ditemukan.</div>;
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 sm:p-8 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold">Undangan Kolaborasi Proyek</h1>
            <p className="text-teal-100 mt-1 text-sm">Anda diundang untuk bergabung dalam proyek berikut:</p>
          </div>

          {/* Detail Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full text-teal-600 shadow-sm">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Judul Proyek</p>
                <p className="text-lg sm:text-xl font-semibold text-slate-800">{collaboration.judul_proyek}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-full text-slate-600 shadow-sm">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Dosen Pengajak</p>
                <p className="text-lg sm:text-xl font-semibold text-slate-800">{collaboration.lecturer_name}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Deskripsi Proyek</p>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border">{collaboration.deskripsi}</p>
            </div>

            {collaboration.pesan_detail && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Pesan dari Dosen</p>
                <div className="flex gap-3 p-4 rounded-lg border bg-slate-50 text-slate-700">
                  <MessageSquare size={20} className="text-slate-400 flex-shrink-0 mt-1" />
>>>>>>> cd61495 (sampai sini)
                  <p className="italic">"{collaboration.pesan_detail}"</p>
                </div>
              </div>
            )}
          </div>

<<<<<<< HEAD
          <div className="p-6 bg-slate-50/70 border-t">
            {collaboration.status === 'pending' ? (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <p className="text-sm font-semibold text-slate-600">Apakah Anda tertarik untuk bergabung?</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleRespond('rejected')}
                    disabled={isResponding}
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-white border border-red-300 text-red-600 font-bold hover:bg-red-50 disabled:opacity-50"
=======
          {/* Footer Actions */}
          <div className="p-6 bg-slate-50/70 border-t flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
            {collaboration.status === 'pending' ? (
              <>
                <p className="text-sm font-medium text-slate-600">Apakah Anda tertarik untuk bergabung?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRespond('rejected')}
                    disabled={isResponding}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-red-400 text-red-600 hover:bg-red-50 disabled:opacity-50 transition duration-200"
>>>>>>> cd61495 (sampai sini)
                  >
                    <X size={16} /> Tolak
                  </button>
                  <button
                    onClick={() => handleRespond('accepted')}
                    disabled={isResponding}
<<<<<<< HEAD
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 disabled:opacity-50"
=======
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 transition duration-200"
>>>>>>> cd61495 (sampai sini)
                  >
                    <Check size={16} /> Terima
                  </button>
                </div>
<<<<<<< HEAD
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2 font-semibold text-lg">
                {collaboration.status === 'accepted' 
                  ? <span className="text-green-600 flex items-center gap-2"><Check size={20}/> Undangan Diterima</span> 
                  : <span className="text-red-600 flex items-center gap-2"><X size={20}/> Undangan Ditolak</span>
                }
=======
              </>
            ) : (
              <div className="flex items-center gap-2 text-lg font-semibold">
                {collaboration.status === 'accepted' ? (
                  <span className="flex items-center text-green-600"><Check size={20} /> Undangan Diterima</span>
                ) : (
                  <span className="flex items-center text-red-600"><X size={20} /> Undangan Ditolak</span>
                )}
>>>>>>> cd61495 (sampai sini)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CollaborationDetail;
=======
export default CollaborationDetail;
>>>>>>> cd61495 (sampai sini)
