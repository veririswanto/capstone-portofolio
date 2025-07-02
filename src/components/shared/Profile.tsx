// KUNCI: UI dirombak total dengan sub-komponen, header yang lebih dinamis, dan layout yang lebih terstruktur.

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, User, Edit, X, Save, GraduationCap, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-Komponen untuk Field Profil (agar kode tidak berulang) ---
interface ProfileFieldProps {
  label: string;
  icon: ReactNode;
  isEditing: boolean;
  value: string | ReactNode;
  children?: ReactNode; // Untuk menampung input/select saat mode edit
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, icon, isEditing, value, children }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-slate-500">
      {icon}
      {label}
    </label>
    <div className="mt-2 text-base text-slate-800">
      {isEditing && children ? children : (
        <div className="w-full px-4 py-2.5 bg-slate-100 rounded-lg min-h-[44px] flex items-center">
          {value || <em className="text-slate-400 font-normal">Belum diisi</em>}
        </div>
      )}
    </div>
  </div>
);

// --- Komponen Utama ---
const Profile: React.FC = () => {
  const { currentUser, token, updateUserAndToken } = useAuth();
  
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [keahlian, setKeahlian] = useState('');
  
  const [originalProfile, setOriginalProfile] = useState({ name: '', nim: '', keahlian: '' });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token || !currentUser) { setLoading(false); return; }
    setLoading(true);
    setName(currentUser.name);
    try {
      const response = await fetch('http://localhost:5000/api/mahasiswa/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Gagal mengambil data profil');
      const data = await response.json();
      setNim(data.nim || '');
      setKeahlian(data.keahlian || '');
      setOriginalProfile({ name: currentUser.name, nim: data.nim || '', keahlian: data.keahlian || '' });
    } catch (error) {
      setMessage({ text: 'Tidak dapat memuat data profil.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, currentUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isSaving) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch('http://localhost:5000/api/mahasiswa/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, nim, keahlian }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal memperbarui profil');
      
      updateUserAndToken(result.user, result.token);
      setMessage({ text: 'Profil berhasil diperbarui!', type: 'success' });
      setIsEditing(false);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan.';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setName(originalProfile.name);
    setNim(originalProfile.nim);
    setKeahlian(originalProfile.keahlian);
    setMessage(null);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat data profil...</div>;
  if (!currentUser) return <div className="p-8 text-center text-red-500">Sesi berakhir. Silakan login ulang.</div>;

  const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition";

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={handleSubmit}>
          {/* --- HEADER PROFIL --- */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <img 
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${name || currentUser.name}&background=0D9488&color=fff&size=128`} 
              alt="Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-3xl font-bold text-slate-800">{isEditing ? name : currentUser.name}</h1>
              <p className="text-slate-500">{currentUser.role === 'student' ? 'Mahasiswa' : currentUser.role}</p>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-semibold shadow-sm"
              >
                <Edit size={16} /> Edit Profil
              </button>
            )}
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            {/* --- INFORMASI AKUN --- */}
            <h2 className="text-xl font-bold text-slate-700 border-b pb-3 mb-6">Informasi Akun</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Nama Lengkap" icon={<User size={16}/>} isEditing={isEditing} value={name}>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </ProfileField>
              <ProfileField label="Email" icon={<Mail size={16}/>} isEditing={false} value={currentUser.email} />
            </div>

            {/* --- PROFIL MAHASISWA --- */}
            <h2 className="text-xl font-bold text-slate-700 border-b pb-3 mb-6 mt-10">Profil Mahasiswa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="NIM (Nomor Induk Mahasiswa)" icon={<GraduationCap size={16}/>} isEditing={isEditing} value={nim}>
                <input id="nim" type="text" value={nim} onChange={(e) => setNim(e.target.value)} className={inputClass} placeholder="Masukkan NIM" />
              </ProfileField>
              <ProfileField label="Keahlian Utama" icon={<Sparkles size={16}/>} isEditing={isEditing} value={keahlian}>
                <select id="keahlian" value={keahlian} onChange={(e) => setKeahlian(e.target.value)} className={inputClass}>
                  <option value="">-- Pilih Keahlian --</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </ProfileField>
            </div>
          </div>
          
          {/* --- TOMBOL AKSI (Hanya muncul saat mode edit) --- */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-end gap-4 mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg sticky bottom-4"
              >
                <button type="button" onClick={handleCancelClick} className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-semibold">
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-300 transition-colors font-semibold">
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* --- AREA PESAN (Message) --- */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-6 p-4 rounded-lg text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;