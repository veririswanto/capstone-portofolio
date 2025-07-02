// LOKASI: src/pages/industry/CollaborationHistory.tsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

// [FIX] Ubah cara mengimpor 'id' menjadi default import
import format from 'date-fns/format'; 
import id from 'date-fns/locale/id'; 

// Tipe data untuk riwayat kolaborasi
interface CollaborationHistoryItem {
  id: string;
  topic: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  student: {
    name: string;
    email: string;
  };
}

const StatusBadge: React.FC<{ status: CollaborationHistoryItem['status'] }> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  const text = {
    pending: 'Menunggu', accepted: 'Diterima', rejected: 'Ditolak', completed: 'Selesai'
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
};

const CollaborationHistory: React.FC = () => {
  const [history, setHistory] = useState<CollaborationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/collaborations/history/industry');
        setHistory(response.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat kolaborasi:", err);
        setError("Tidak dapat memuat riwayat. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Memuat riwayat...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800">Riwayat Ajakan Kolaborasi</h1>
      <p className="mt-2 text-slate-600 mb-6">Daftar ajakan kolaborasi yang pernah Anda kirimkan.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-6 py-4 font-semibold text-slate-600 text-left">Mahasiswa Tujuan</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-left">Topik</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-left">Tanggal Kirim</th>
              <th className="px-6 py-4 font-semibold text-slate-600 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.id} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{item.student.name}</div>
                    <div className="text-xs text-slate-500">{item.student.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{item.topic}</div>
                    <div className="text-xs text-slate-500 truncate" title={item.description}>{item.description}</div>
                  </td>
                  <td className="px-6 py-4">{format(new Date(item.createdAt), 'dd MMMM yyyy', { locale: id })}</td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={item.status} /></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center p-8 text-slate-500">Anda belum pernah mengirim ajakan kolaborasi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollaborationHistory;