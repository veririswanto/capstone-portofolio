import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Pencil, X, Link as LinkIcon } from 'lucide-react'; // <-- Import LinkIcon
import api from '../../services/api'; 
import fileImage from '../../assets/file.png';


interface PortofolioItem {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  file_url: string | null;
  tautan?: string | null; 
  created_at: string;
}


const FileModal: React.FC<{ fileUrl: string | null; onClose: () => void }> = ({ fileUrl, onClose }) => {
  const fullFileUrl = fileUrl ? `http://localhost:5000${fileUrl}` : fileImage;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg max-w-lg w-full relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black"> <X size={24} /> </button>
        <img src={fullFileUrl} alt="Hasil Proyek" className="w-full rounded" />
      </div>
    </div>
  );
};


const FormProyek: React.FC<{
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData: PortofolioItem | null;
}> = ({ onSubmit, onCancel, initialData }) => {
  const isEditMode = !!initialData;
  const [judul, setJudul] = useState(initialData?.judul || '');
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [tautan, setTautan] = useState(initialData?.tautan || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(initialData?.file_url?.split('/').pop() || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('tautan', tautan || ''); 
    formData.append('kategori', 'Proyek');
    if (selectedFile) {
      formData.append('portofolioFile', selectedFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Judul Proyek</label>
          <input value={judul} onChange={(e) => setJudul(e.target.value)} required className="w-full p-4 rounded-xl bg-teal-50 border border-teal-200" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Tautan / Github</label>
          <input value={tautan || ''} onChange={(e) => setTautan(e.target.value)} className="w-full p-4 rounded-xl bg-teal-50 border border-teal-200" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Deskripsi Proyek</label>
          <textarea rows={4} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required className="w-full p-4 rounded-xl bg-teal-50 border border-teal-200" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Unggah Hasil (Opsional)</label>
          <label htmlFor="file-upload" className="flex items-center justify-center h-40 bg-teal-50 border-2 border-dashed border-teal-200 rounded-xl cursor-pointer hover:bg-teal-100">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-teal-600" />
              <p className="text-gray-500 text-sm">{fileName || 'Pilih File (Gambar atau PDF)'}</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100">Batal</button>
        <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600">{isEditMode ? 'Simpan Perubahan' : 'Simpan Proyek'}</button>
      </div>
    </form>
  );
};


const TabelProyek: React.FC<{
  data: PortofolioItem[];
  onEdit: (item: PortofolioItem) => void;
  onDelete: (id: string) => void;
  onViewFile: (fileUrl: string | null) => void;
}> = ({ data, onEdit, onDelete, onViewFile }) => (
  <div className="bg-teal-500 rounded-xl p-4 shadow-lg">
    <div className="overflow-x-auto bg-white rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="text-gray-800">
          <tr className="border-b">
            <th className="px-4 py-3 text-left w-12">No</th>
            <th className="px-4 py-3 text-left">Judul Proyek</th>
            <th className="px-4 py-3 text-left">Deskripsi</th>
            <th className="px-4 py-3 text-left">File</th>
            <th className="px-4 py-3 text-left">Tautan</th> 
            <th className="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.length === 0 ? (
            <tr><td colSpan={6} className="p-6 text-center text-gray-500">Belum ada data proyek.</td></tr> 
          ) : (
            data.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3 font-semibold">{item.judul}</td>
                <td className="px-4 py-3">{item.deskripsi}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onViewFile(item.file_url)} disabled={!item.file_url} className="text-gray-600 hover:text-teal-600 disabled:text-gray-300">
                    <FileText size={18} />
                  </button>
                </td>
                <td className="px-4 py-3"> 
                  {item.tautan ? (
                    <a href={item.tautan} target="_blank" rel="noopener noreferrer" title={item.tautan} className="text-teal-600 hover:text-teal-800">
                      <LinkIcon size={18} />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => onDelete(item.id)} className="text-gray-600 hover:text-red-500"> <Trash2 size={18} /> </button>
                    <button onClick={() => onEdit(item)} className="text-gray-600 hover:text-blue-500"> <Pencil size={18} /> </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);



const KelolaProyek: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');
  const [proyekList, setProyekList] = useState<PortofolioItem[]>([]);
  const [editingData, setEditingData] = useState<PortofolioItem | null>(null);
  const [modalFileUrl, setModalFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProyek = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/portfolio');
      const allPortfolio: PortofolioItem[] = response.data;
      const filteredProyek = allPortfolio.filter(item => item.kategori === 'Proyek');
      setProyekList(filteredProyek);
    } catch (error) {
      console.error("Gagal mengambil data proyek:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'list') {
      fetchProyek();
    }
  }, [activeView]);

  const handleEdit = (item: PortofolioItem) => {
    setEditingData(item);
    setActiveView('form');
  };

  const handleAddNew = () => {
    setEditingData(null);
    setActiveView('form');
  };

  const handleCancel = () => {
    setEditingData(null);
    setActiveView('list');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      try {
        await api.delete(`/portfolio/${id}`);
        fetchProyek();
      } catch (error) {
        console.error("Gagal menghapus proyek:", error);
        alert("Gagal menghapus proyek.");
      }
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (editingData) {
        await api.put(`/portfolio/${editingData.id}`, data);
      } else {
        await api.post('/portfolio', data);
      }
      setActiveView('list');
      setEditingData(null);
    } catch (error) {
      console.error("Gagal menyimpan proyek:", error);
      alert("Gagal menyimpan proyek. Pastikan semua field terisi.");
    }
  };

  return (
    <>
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeView === 'list' ? 'Daftar Proyek' : editingData ? 'Edit Proyek' : 'Tambah Proyek'}
          </h1>
          <div className="flex gap-2">
            <button onClick={handleAddNew} className="px-4 py-2 rounded-lg border text-sm bg-white text-gray-700 hover:bg-gray-50">
              Tambah Proyek
            </button>
            <button onClick={() => setActiveView('list')} className="px-4 py-2 rounded-lg border text-sm bg-white text-gray-700 hover:bg-gray-50">
              Daftar
            </button>
          </div>
        </div>
        {activeView === 'form' ? (
          <FormProyek onSubmit={handleSubmit} onCancel={handleCancel} initialData={editingData} />
        ) : isLoading ? (
          <div className="text-center py-10">Memuat data proyek...</div>
        ) : (
          <TabelProyek data={proyekList} onEdit={handleEdit} onDelete={handleDelete} onViewFile={(url) => setModalFileUrl(url)} />
        )}
      </div>
      {modalFileUrl !== null && <FileModal fileUrl={modalFileUrl} onClose={() => setModalFileUrl(null)} />}
    </>
  );
};

export default KelolaProyek;